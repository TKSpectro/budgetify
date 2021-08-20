import { gql, useQuery } from '@apollo/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Overview from '~/components/Household/Overview';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String, $startDate: String, $endDate: String) {
    household(id: $householdId) {
      id
      name
      owner {
        firstname
        lastname
      }
      payments(limit: 4) {
        id
        name
        value
        createdAt
        category {
          id
          name
        }
      }
      thisMonthsPayments: payments(startDate: $startDate, endDate: $endDate) {
        name
        value
        createdAt
        category {
          name
        }
      }
      recurringPayments(limit: 4) {
        id
        name
        value
        interval
        nextBooking
      }
    }
  }
`;

export default function Households() {
  const router = useRouter();
  const { householdId } = router.query;
  const { data, loading, error } = useQuery(HOUSEHOLD_QUERY, {
    variables: {
      householdId,
      startDate: startOfMonth(new Date()).toISOString(),
      endDate: endOfMonth(new Date()).toISOString(),
    },
  });

  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;
  if (loading) return <span>loading...</span>;

  return (
    <div className="mt-12 mx-4 sm:mx-24">
      <Head>
        <title>{data.household.name + ' | ' + 'budgetify'}</title>
      </Head>
      <div className="text-7xl text-brand-500">{data.household.name}</div>
      <div className="mt-12 text-4xl">
        Total balance{' '}
        {
          // Add up the value of all payments for the total balance
          data.household.payments.reduce(
            (sum: number, payment: Payment) => +sum + +payment.value,
            0.0,
          )
        }
      </div>
      <Overview
        payments={data.household.payments}
        recurringPayments={data.household.recurringPayments}
        monthPayments={data.household.thisMonthsPayments}
      />
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
