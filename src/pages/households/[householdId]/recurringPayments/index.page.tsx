import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NewRecurringPayment } from '~/components/Household/RecurringPayments/NewRecurringPayment';
import { RecurringPaymentTable } from '~/components/Household/RecurringPayments/RecurringPaymentTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Category, RecurringPayment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { Query, QueryVariables } from './__generated__/index.page.generated';

const QUERY = gql`
  query QUERY($householdId: String) {
    household(id: $householdId) {
      id
      name
      recurringPayments {
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
    categories {
      id
      name
    }
  }
`;

export default function RecurringPayments() {
  const router = useRouter();
  const householdId = router.query.householdId as string;

  const { data, loading, error, refetch } = useQuery<Query, QueryVariables>(QUERY, {
    variables: {
      householdId,
    },
  });

  const recurringPayments = data?.household?.recurringPayments;

  type Test = Query['household'];

  const categories = data?.categories;

  return (
    <>
      <Head>
        <title>Recurring Payments | budgetify</title>
      </Head>

      <Container>
        <Error title="Failed to load recurring payments" error={error} />
        <Error
          title="Could not find any recurring payments. Please create a new one."
          error={!loading && !error && recurringPayments?.length === 0 ? '' : undefined}
        />
        <Loader loading={loading} />

        <NewRecurringPayment categories={categories as Category[]} />
      </Container>
      {recurringPayments?.length !== 0 && (
        <RecurringPaymentTable
          recurringPayments={recurringPayments as RecurringPayment[]}
          categories={categories as Category[]}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: QUERY,
    variables: { householdId: ctx.params!.householdId },
  });
};
