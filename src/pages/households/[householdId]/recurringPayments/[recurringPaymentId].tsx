import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Alert } from '~/components/UI/Alert';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { MutationCreateRecurringPaymentArgs } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const RECURRING_PAYMENT_QUERY = gql`
  query RECURRING_PAYMENT_QUERY($householdId: String, $recurringPaymentId: String) {
    household(id: $householdId) {
      id
      name
      recurringPayments(id: $recurringPaymentId) {
        id
        name
        value
        description
        createdAt
        startDate
        endDate
        nextBooking
        lastBooking
        interval
        category {
          name
        }
      }
    }
  }
`;

export default function EditRecurringPayment() {
  const router = useRouter();
  const { householdId, recurringPaymentId } = router.query;

  const { data, loading, error } = useQuery(RECURRING_PAYMENT_QUERY, {
    variables: {
      householdId,
      recurringPaymentId,
    },
  });
  const form = useForm<MutationCreateRecurringPaymentArgs>();
  const recurringPayment = data?.household?.recurringPayments[0];

  const onSubmit = (data: MutationCreateRecurringPaymentArgs) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>{recurringPayment?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container>
        <Error title="Failed to load recurring payment" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !recurringPayment ? (
          <Alert message="Could not find this  recurring payment." type="error" />
        ) : null}
        {!loading && !error && recurringPayment && (
          <>
            <div>Edit Recurring Payment {recurringPayment.name}</div>
            <Form form={form} onSubmit={onSubmit}>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Input label="Name" type="text"></Input>
              <Button type="submit">Create</Button>
            </Form>
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: RECURRING_PAYMENT_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
      recurringPaymentId: ctx.params!.recurringPaymentId,
    },
  });
};
