import { gql, useQuery } from '@apollo/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import MonthOverview from '~/components/Household/MonthOverview';
import PaymentOverview from '~/components/Household/PaymentOverview';
import RecurringPaymentOverview from '~/components/Household/RecurringPaymentOverview';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String, $startDate: DateTime, $endDate: DateTime) {
    me {
      id
    }
    household(id: $householdId) {
      id
      name
      owner {
        id
        firstname
        lastname
      }
      payments(limit: 6) {
        id
        name
        value
        createdAt
        category {
          id
          name
        }
      }
      sumOfAllPayments
      thisMonthsPayments: payments(startDate: $startDate, endDate: $endDate) {
        name
        value
        createdAt
        category {
          name
        }
      }
      recurringPayments(limit: 6) {
        id
        name
        value
        interval
        nextBooking
      }
    }
  }
`;

export default function Household() {
  const router = useRouter();
  const { householdId } = router.query;
  const { data, loading, error } = useQuery(HOUSEHOLD_QUERY, {
    variables: {
      householdId,
      startDate: startOfMonth(new Date()).toISOString(),
      endDate: endOfMonth(new Date()).toISOString(),
    },
  });

  const household = data?.household;
  const payments = household?.payments || [];
  const sumOfAllPayments = household.sumOfAllPayments || 0;

  const isOwner = household?.owner?.id === data?.me?.id;

  return (
    <div className="sm:mx-24">
      <Head>
        <title>{household?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Error title="Failed to load household" error={error} />
      <Error
        title="Could not find this household."
        error={!loading && !household ? '' : undefined}
      />
      <Loader loading={loading} />

      {!error && household && (
        <>
          <div className="mx-4 my-4">
            <div className="relative text-6xl text-brand-500">
              {data.household.name}
              {isOwner && (
                <span className="hidden md:block absolute right-4 top-6 text-base">
                  <Link href={router.asPath + '/manage'} asButton>
                    Manage
                  </Link>
                </span>
              )}
            </div>

            <div className="mt-4 text-4xl">
              Total balance{' ' + roundOn2(sumOfAllPayments) + '€'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-16 overflow-auto">
            <PaymentOverview payments={payments} />

            <RecurringPaymentOverview recurringPayments={household.recurringPayments} />

            <MonthOverview monthPayments={household.thisMonthsPayments} />
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
      startDate: startOfMonth(new Date()).toISOString(),
      endDate: endOfMonth(new Date()).toISOString(),
    },
  });
};
