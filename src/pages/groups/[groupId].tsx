import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserMultiSelect } from '~/components/Group/UserMultiselect';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { ModalForm } from '~/components/UI/ModalForm';
import { Switch } from '~/components/UI/Switch';
import {
  GroupTransaction,
  MutationCreateGroupTransactionArgs,
  Participant,
  TransactionType,
  User,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!) {
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
      members {
        id
        name
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
  const groupId = router.query.groupId;

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

  const form = useForm<MutationCreateGroupTransactionArgs>({
    defaultValues: { name: '', value: 0, groupId: groupId as string, participantIds: [] },
  });

  const onSubmitHandler = () => {
    // if the user is topping up his account we overwrite the participantIds with an empty array
    // so its more consistent on the database layer
    if (formStateIsCashout) {
      createGroupTransaction({
        variables: {
          ...form.getValues(),
          // Force the value to be negative as the user input will be positive
          value: -Math.abs(form.getValues('value')),
          type: formStateIsBuyingFood ? TransactionType.Buy : TransactionType.TakeOut,
          // Check if the all user switch is set depending on that we take all group members
          // or just the ones that are checked.
          participantIds: formAllGroupMembers
            ? members.map((member) => member.id)
            : form.getValues('participantIds'),
        },
      });
    } else {
      // Top up
      createGroupTransaction({
        variables: {
          ...form.getValues(),
          type: TransactionType.TopUp,
          participantIds: [],
        },
      });
    }
  };

  // Need to handle the participantIds with a custom function which will get called from the UserPicker
  const setValueHandlerParticipantIds = (members: User[]) => {
    form.setValue(
      'participantIds',
      members.map((member) => member.id),
    );
  };

  const group = data?.group;

  const members: User[] = group?.members;
  const memberBalances = data?.calculateMemberBalances;

  const [formStateIsCashout, setFormStateIsCashout] = useState(false);
  const [formStateIsBuyingFood, setFormStateIsBuyingFood] = useState(true);
  const [formAllGroupMembers, setFormAllGroupMembers] = useState(true);

  return (
    <>
      <Container>
        {loading && <LoadingAnimation />}
        <Error title="Could not load group." error={error} />
        <Error title="Could not create transaction." error={createGroupTransactionError} />
        {group && (
          <div className="relative">
            <div className="text-xl font-bold ">{group.name}</div>
            <div className="text-lg font-medium">Group balance: {group.value}€</div>

            <ModalForm
              title="New Transaction"
              buttonText="New Transaction"
              buttonClassName="md:absolute right-4 top-2 text-base"
              form={form}
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
                {...form.register('name', {
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
                {...form.register('value', {
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
                  {...form.register('participantIds')}
                />
              )}
            </ModalForm>
          </div>
        )}
      </Container>
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
