import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert } from '~/components/UI/Alert';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { RecurringPayment } from '~/graphql/__generated__/types';
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
        nextBooking
        lastBooking
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
          <Error title="Failed to load recurring messages" error={error} />
          {loading && <LoadingAnimation />}
          {!loading && !error && recurringPayments.length === 0 ? (
            <Alert
              message="Could not find any recurring messages. Please create a new one"
              type="warning"
            />
          ) : (
            recurringPayments.map((recPayment: RecurringPayment) => {
              // TODO: Build recurring payment component
              return (
                <div key={recPayment.id}>
                  {recPayment.name} {recPayment.value}
                </div>
              );
            })
          )}
        </Container>
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
