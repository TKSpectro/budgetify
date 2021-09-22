import { gql, useMutation, useQuery } from '@apollo/client';
import { CogIcon, TrashIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { CreateGroupTransaction } from '~/components/Group/CreateGroupTransaction';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Progressbar } from '~/components/UI/Progressbar';
import {
  GroupTransaction,
  MutationUpdateThresholdArgs,
  Participant,
  Threshold,
  ThresholdType,
  User,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!) {
    me {
      id
    }
    group(id: $id) {
      id
      name
      value
      transactions {
        id
        name
        value
        participants {
          name
        }
      }
      owners {
        id
        name
      }
      members {
        id
        name
      }
      thresholds {
        id
        name
        type
        value
      }
    }
    calculateMemberBalances(id: $id) {
      name
      userId
      value
    }
  }
`;

const UPDATE_THRESHOLD_MUTATION = gql`
  mutation UPDATE_THRESHOLD_MUTATION(
    $id: String!
    $groupId: String!
    $name: String
    $value: Money
    $type: ThresholdType
  ) {
    updateThreshold(id: $id, groupId: $groupId, name: $name, type: $type, value: $value) {
      id
      name
      value
      type
    }
  }
`;

const REMOVE_THRESHOLD_MUTATION = gql`
  mutation REMOVE_THRESHOLD_MUTATION($id: String!, $groupId: String!) {
    removeThreshold(id: $id, groupId: $groupId) {
      id
    }
  }
`;

export default function Group() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error, refetch } = useQuery(GROUP_QUERY, { variables: { id: groupId } });

  const [updateThreshold, { error: updateThresholdError }] = useMutation(
    UPDATE_THRESHOLD_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['GROUP_QUERY'],
    },
  );

  const [removeThreshold, { error: removeThresholdError }] = useMutation(
    REMOVE_THRESHOLD_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['GROUP_QUERY'],
    },
  );

  const updateThresholdForm = useForm<MutationUpdateThresholdArgs>({
    defaultValues: { id: '', name: '', value: 0, type: ThresholdType.Goal, groupId: '' },
  });

  const group = data?.group;

  const members: User[] = group?.members;
  const memberBalances = data?.calculateMemberBalances;

  const thresholds = group?.thresholds;

  const onUpdateThresholdSelectHandler = (threshold: Threshold) => {
    updateThresholdForm.reset({
      ...threshold,
    });
  };

  const onUpdateThresholdHandler = (threshold: Threshold) => {
    updateThreshold({
      variables: { ...updateThresholdForm.getValues(), id: threshold.id, groupId: groupId },
    });
  };

  const onRemoveThresholdHandler = (threshold: Threshold) => {
    removeThreshold({ variables: { id: threshold.id, groupId: groupId } });
  };

  return (
    <>
      <div className="grid grid-cols-1 divide-y-8 sm:divide-y-0">
        <Container>
          <Error title="Could not load group." error={error} />

          <Loader loading={loading} />

          {group && (
            <div className="relative">
              <div className="text-xl font-bold ">{group.name}</div>
              <div className="text-lg font-medium">Group balance: {group.value}€</div>

              <CreateGroupTransaction members={members} />

              {/* // TODO: Style better */}
              {data && !!group?.owners?.find((x: User) => x?.id === data.me.id) && (
                <div className="md:absolute right-48 top-2 text-base">
                  <Link href={`${router.asPath}/manage`} asButton>
                    Manage
                  </Link>
                </div>
              )}
            </div>
          )}
        </Container>

        {thresholds && (
          <Container>
            <Disclosure text="Thresholds" showOpen>
              <Error title="Could not update threshold." error={updateThresholdError} />
              <Error title="Could not remove threshold." error={removeThresholdError} />

              {thresholds.map((threshold: Threshold) => {
                return (
                  <div key={threshold.id}>
                    {(threshold.type === ThresholdType.Goal ||
                      threshold.type === ThresholdType.Max) && (
                      <Progressbar
                        progress={roundOn2((group.value / threshold.value) * 100)}
                        text={threshold.name}
                        type={threshold.type}
                        value={threshold.value + '€'}
                      />
                    )}
                    {/* // TODO: Figure out how to smartly show a min type threshold */}
                    {threshold.type === ThresholdType.Min && (
                      <Progressbar
                        progress={roundOn2(
                          (threshold.value !== 0
                            ? group.value - threshold.value
                            : group.value - 0) * 1,
                        )}
                        text={threshold.name}
                        type={threshold.type}
                        value={threshold.value + '€'}
                      />
                    )}
                    {/* // TODO: Could use transparent button style but would need other placement */}
                    {!!group?.owners?.find((x: User) => x?.id === data?.me?.id).id && (
                      <div className="text-right">
                        <ModalForm
                          form={updateThresholdForm}
                          buttonText={<CogIcon className="w-5 h-5" />}
                          buttonClassName="mr-2"
                          onSubmit={() => {
                            onUpdateThresholdHandler(threshold);
                          }}
                          onClick={() => {
                            onUpdateThresholdSelectHandler(threshold);
                          }}
                          title="Edit"
                        >
                          <Input
                            label="Name"
                            type="text"
                            {...updateThresholdForm.register('name', {
                              required: { value: true, message: 'Name is required' },
                              minLength: {
                                value: 2,
                                message: 'Name must be at least 2 characters',
                              },
                            })}
                          />

                          <Input
                            label="Value"
                            type="number"
                            step="any"
                            {...updateThresholdForm.register('value', {
                              required: { value: true, message: 'Value is required' },
                              valueAsNumber: true,
                            })}
                          />

                          <label>
                            Type
                            <select
                              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                              {...updateThresholdForm.register('type', {
                                required: { value: true, message: 'Please choose a type' },
                              })}
                            >
                              <option key={ThresholdType.Goal} value={ThresholdType.Goal}>
                                {ThresholdType.Goal}
                              </option>
                              <option key={ThresholdType.Max} value={ThresholdType.Max}>
                                {ThresholdType.Max}
                              </option>
                              <option key={ThresholdType.Min} value={ThresholdType.Min}>
                                {ThresholdType.Min}
                              </option>
                            </select>
                          </label>
                        </ModalForm>
                        <Modal
                          buttonText={<TrashIcon className="w-5 h-5" />}
                          onSubmit={() => {
                            onRemoveThresholdHandler(threshold);
                          }}
                          title="Remove threshold"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <NewThreshold />
            </Disclosure>
          </Container>
        )}

        {memberBalances && (
          <Container>
            <div className="text-lg font-semibold">Member Balances</div>
            <div className="w-full divide-y-2">
              {memberBalances.map((member: Participant) => {
                return (
                  <div key={member.userId} className="grid grid-cols-2 py-1">
                    <div className="">{member.name}</div>
                    <div
                      className={clsx('text-right', {
                        'text-red-600 dark:text-red-500': member.value < 0,
                      })}
                    >
                      {member.value + '€'}
                    </div>{' '}
                  </div>
                );
              })}
            </div>
          </Container>
        )}

        {group?.transactions && (
          <Container>
            <div className="text-lg font-semibold">Transactions</div>
            <div className="divide-y-2">
              {group.transactions.map((transaction: GroupTransaction) => {
                // TODO: Need to style this a bit better
                return (
                  <div key={transaction.id}>
                    <Disclosure
                      text={transaction.name + ' : ' + transaction.value + '€'}
                      overflowText={
                        transaction.participants?.length === 1
                          ? transaction.participants[0]?.name
                          : ''
                      }
                      showOpen={!!transaction.participants && transaction.participants?.length > 1}
                    >
                      <div>
                        {transaction.participants?.map((user, id, array) => {
                          return (
                            <span key={user?.id || id}>
                              {user?.name + (id !== array.length - 1 ? ' | ' : '')}
                            </span>
                          );
                        })}
                      </div>
                    </Disclosure>
                  </div>
                );
              })}
            </div>
          </Container>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: GROUP_QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
