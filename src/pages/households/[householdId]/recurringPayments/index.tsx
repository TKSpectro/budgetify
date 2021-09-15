import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RecurringPaymentTable } from '~/components/Household/RecurringPayments/RecurringPaymentTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HOUSEHOLD_RECURRING_PAYMENTS_QUERY = gql`
  query HOUSEHOLD_RECURRING_PAYMENTS_QUERY($householdId: String) {
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
  }
`;

export default function RecurringPayments() {
  const router = useRouter();
  const { householdId } = router.query;
  const { data, loading, error, refetch } = useQuery(HOUSEHOLD_RECURRING_PAYMENTS_QUERY, {
    variables: {
      householdId,
    },
  });

  const recurringPayments = data?.household?.recurringPayments || [];

  return (
    <>
      <Head>
        <title>Recurring Payments | budgetify</title>
      </Head>

      <div className="mt-16">
        <Container>
          <Error title="Failed to load recurring payments" error={error} />
          <Error
            title="Could not find any recurring payments. Please create a new one."
            error={!loading && !error && recurringPayments.length === 0 ? '' : undefined}
          />
          <Loader loading={loading} />

          <div className="flex flex-row-reverse">
            <Link href={router.asPath + '/new'} asButton>
              New Recurring Payment
            </Link>
          </div>
        </Container>
        {!loading && !error && recurringPayments && (
          <RecurringPaymentTable recurringPayments={recurringPayments} />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_RECURRING_PAYMENTS_QUERY,
    variables: { householdId: ctx.params!.householdId },
  });
};
