import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { UserMultiSelect } from '~/components/Group/UserMultiselect';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { ModalForm } from '~/components/UI/ModalForm';
import { Progressbar } from '~/components/UI/Progressbar';
import { Switch } from '~/components/UI/Switch';
import {
  GroupTransaction,
  MutationCreateGroupTransactionArgs,
  Participant,
  Threshold,
  ThresholdType,
  TransactionType,
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

const CREATE_GROUP_TRANSACTION_MUTATION = gql`
  mutation CREATE_GROUP_TRANSACTION_MUTATION(
    $name: String!
    $value: Money!
    $type: TransactionType!
    $groupId: String!
    $participantIds: [String!]!
  ) {
    createGroupTransaction(
      name: $name
      value: $value
      type: $type
      groupId: $groupId
      participantIds: $participantIds
    ) {
      id
    }
  }
`;

export default function Group() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error, refetch } = useQuery(GROUP_QUERY, { variables: { id: groupId } });

  const [
    createGroupTransaction,
    {
      data: createGroupTransactionData,
      loading: createGroupTransactionLoading,
      error: createGroupTransactionError,
    },
  ] = useMutation(CREATE_GROUP_TRANSACTION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const formCreateGroupTransaction = useForm<MutationCreateGroupTransactionArgs>({
    defaultValues: { name: '', value: 0, groupId: groupId as string, participantIds: [] },
  });

  const onSubmitHandler = () => {
    // if the user is topping up his account we overwrite the participantIds with an empty array
    // so its more consistent on the database layer
    if (formStateIsCashout) {
      createGroupTransaction({
        variables: {
          ...formCreateGroupTransaction.getValues(),
          // Force the value to be negative as the user input will be positive
          value: -Math.abs(formCreateGroupTransaction.getValues('value')),
          type: formStateIsBuyingFood ? TransactionType.Buy : TransactionType.TakeOut,
          // Check if the all user switch is set depending on that we take all group members
          // or just the ones that are checked.
          participantIds: formAllGroupMembers
            ? members.map((member) => member.id)
            : formCreateGroupTransaction.getValues('participantIds'),
        },
      });
    } else {
      // Top up
      createGroupTransaction({
        variables: {
          ...formCreateGroupTransaction.getValues(),
          type: TransactionType.TopUp,
          participantIds: [],
        },
      });
    }
  };

  // Need to handle the participantIds with a custom function which will get called from the UserPicker
  const setValueHandlerParticipantIds = (members: User[]) => {
    formCreateGroupTransaction.setValue(
      'participantIds',
      members.map((member) => member.id),
    );
  };

  const group = data?.group;

  const members: User[] = group?.members;
  const memberBalances = data?.calculateMemberBalances;

  const thresholds = group?.thresholds;

  const [formStateIsCashout, setFormStateIsCashout] = useState(false);
  const [formStateIsBuyingFood, setFormStateIsBuyingFood] = useState(true);
  const [formAllGroupMembers, setFormAllGroupMembers] = useState(true);

  return (
    <>
      <Container>
        <Error title="Could not load group." error={error} />
        <Error title="Could not create transaction." error={createGroupTransactionError} />
        <Loader loading={loading} />

        {group && (
          <div className="relative">
            <div className="text-xl font-bold ">{group.name}</div>
            <div className="text-lg font-medium">Group balance: {group.value}€</div>

            <ModalForm
              title="New Transaction"
              buttonText="New Transaction"
              buttonClassName="md:absolute right-4 top-2 text-base"
              form={formCreateGroupTransaction}
              submitText="Create"
              description={`You can switch between topping up your account (account balance) and buying food / taking money out of the group balance`}
              onSubmit={onSubmitHandler}
            >
              {/* // TODO: Somehow make this look and feel better */}
              <label>
                Switch between transaction modes
                <Switch
                  isLeft={formStateIsCashout}
                  onClick={() => setFormStateIsCashout(!formStateIsCashout)}
                  leftIcon={<PlusIcon className="w-4 h-4 " />}
                  rightIcon={<MinusIcon className="w-4 h-4 text-brand-400" />}
                />
              </label>

              <Input
                label="Name*"
                type="text"
                {...formCreateGroupTransaction.register('name', {
                  required: { value: true, message: 'Name is required' },
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
              />

              {formStateIsCashout && (
                <label>
                  Take out money / Bought food
                  <Switch
                    isLeft={formStateIsBuyingFood}
                    onClick={() => setFormStateIsBuyingFood(!formStateIsBuyingFood)}
                    leftIcon={<XIcon className="w-4 h-4 " />}
                    rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
                  />
                </label>
              )}

              <Input
                label={
                  formStateIsCashout
                    ? formStateIsBuyingFood
                      ? 'Bought food*'
                      : 'Take money out*'
                    : 'Top up account balance*'
                }
                type="number"
                step="any"
                {...formCreateGroupTransaction.register('value', {
                  required: { value: true, message: 'Value is required' },
                  min: { value: 0, message: 'Value must be positive' },
                  valueAsNumber: true,
                })}
              />

              {/* // TODO: Somehow make this look and feel better */}
              {formStateIsCashout && formStateIsBuyingFood && (
                <label>
                  All group members?
                  <Switch
                    isLeft={formAllGroupMembers}
                    onClick={() => setFormAllGroupMembers(!formAllGroupMembers)}
                    leftIcon={<XIcon className="w-4 h-4 " />}
                    rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
                  />
                </label>
              )}

              {formStateIsCashout && !formAllGroupMembers && (
                <UserMultiSelect
                  items={members}
                  setValue={setValueHandlerParticipantIds}
                  {...formCreateGroupTransaction.register('participantIds')}
                />
              )}
            </ModalForm>
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
            {thresholds.map((threshold: Threshold) => {
              return (
                <div key={threshold.id}>
                  {(threshold.type === ThresholdType.Goal ||
                    threshold.type === ThresholdType.Max) && (
                    <Progressbar
                      progress={roundOn2((group.value / threshold.value) * 100)}
                      text={threshold.name}
                      type={threshold.type}
                    />
                  )}
                  {/* // TODO: Figure out how to smartly show a min type threshold */}
                  {threshold.type === ThresholdType.Min && (
                    <Progressbar
                      progress={roundOn2(
                        (threshold.value !== 0 ? group.value - threshold.value : group.value - 0) *
                          1,
                      )}
                      text={threshold.name}
                      type={threshold.type}
                    />
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
