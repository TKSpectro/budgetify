import { gql, useMutation, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
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

const CREATE_GROUP_PAYMENT_MUTATION = gql`
  mutation CREATE_GROUP_PAYMENT_MUTATION(
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
    createGroupPayment,
    {
      data: createGroupPaymentData,
      loading: createGroupPaymentLoading,
      error: createGroupPaymentError,
    },
  ] = useMutation(CREATE_GROUP_PAYMENT_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
      refetch();
    },
    onError: () => {},
  });

  const form = useForm<MutationCreateGroupTransactionArgs>({
    defaultValues: { name: '', value: 0, groupId: groupId as string },
  });

  const onSubmitHandler = () => {
    console.log(form.getValues());
    //createGroupPayment({ variables: { ...form.getValues() } });
  };

  const group = data?.group;

  const members: User[] = group.members;
  const memberBalances = data?.calculateMemberBalances;

  return (
    <>
      <Container>
        {loading && <LoadingAnimation />}
        <Error title="Could not load group." error={error} />
        <Error title="Could not create transaction." error={createGroupPaymentError} />
        {group && (
          <div className="relative">
            <div className="text-xl font-bold ">{group.name}</div>
            <div className="text-lg font-medium">Group balance: {group.value}€</div>

            <ModalForm
              title="New Payment"
              buttonText="New Payment"
              buttonClassName="md:absolute right-4 top-2 text-base"
              form={form}
              submitText="Create"
              description={`Negative value = You have taken out money -> Bought food.
              Positive value = You have put money in -> Payed for your meal.`}
              onSubmit={onSubmitHandler}
            >
              <Input label="Name" type="text" {...form.register('name', { required: true })} />
              <Input
                label="Value"
                type="number"
                {...form.register('value', { required: true, valueAsNumber: true })}
              />
              <UserMultiSelect
                items={members}
                {...form.register('participantIds', { value: ['', ''] })}
              />
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
          <div className="text-lg font-semibold">Payments</div>
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
