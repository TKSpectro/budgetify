import { gql, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserMultiSelect } from '~/components/Group/UserMultiselect';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  GroupTransaction,
  MutationCreateGroupTransactionArgs,
  Participant,
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
    $value: Float!
    $groupId: String!
    $participantIds: [String!]!
  ) {
    createGroupTransaction(
      name: $name
      value: $value
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

  const members: User[] = group.members;
  const memberBalances = data?.calculateMemberBalances;

  const [formStateIsCashout, setFormStateIsCashout] = useState(false);
  const [formAllGroupMembers, setFormAllGroupMembers] = useState(true);

  const handleChange = () => {
    setFormStateIsCashout(!formStateIsCashout);
  };

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
                Switch beetwen transaction modes
                <div className="items-center" onClick={handleChange}>
                  <div
                    className={clsx(
                      'w-12 h-6 items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out',
                      { 'bg-brand-400': formStateIsCashout === true },
                    )}
                  >
                    <div
                      className={clsx(
                        'bg-white dark:bg-gray-800 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out',
                        { 'translate-x-6': formStateIsCashout === true },
                      )}
                    >
                      {formStateIsCashout === false ? (
                        <PlusIcon className="w-4 h-4 " />
                      ) : (
                        <MinusIcon className="w-4 h-4 text-brand-400" />
                      )}
                    </div>
                  </div>
                </div>
              </label>

              <Input label="Name" type="text" {...form.register('name', { required: true })} />
              <Input
                label={formStateIsCashout ? 'Bought food / Take money out' : 'Top up account'}
                type="number"
                {...form.register('value', { required: true, valueAsNumber: true, min: 0 })}
              />

              {/* // TODO: Somehow make this look and feel better */}
              {formStateIsCashout && (
                <label>
                  All group members?
                  <div
                    className="items-center"
                    onClick={() => setFormAllGroupMembers(!formAllGroupMembers)}
                  >
                    <div
                      className={clsx(
                        'w-12 h-6 items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out',
                        { 'bg-brand-400': formAllGroupMembers === true },
                      )}
                    >
                      <div
                        className={clsx(
                          'bg-white dark:bg-gray-800 w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out',
                          { 'translate-x-6': formAllGroupMembers === true },
                        )}
                      >
                        {formAllGroupMembers === false ? (
                          <XIcon className="w-4 h-4 " />
                        ) : (
                          <CheckIcon className="w-4 h-4 text-brand-400" />
                        )}
                      </div>
                    </div>
                  </div>
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
      {group.transactions && (
        <Container>
          <div className="text-lg font-semibold">Transactions</div>
          {group.transactions.map((transaction: GroupTransaction) => {
            return (
              <div key={transaction.id}>{transaction.name + ' : ' + transaction.value + '€'}</div>
            );
          })}
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
