import { gql, useQuery } from '@apollo/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Overview from '~/components/Household/Overview';
import { Alert } from '~/components/UI/Alert';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String, $startDate: String, $endDate: String) {
    household(id: $householdId) {
      id
      name
      owner {
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

  const household = data?.household;
  const payments = data?.household?.payments || [];

  // Add up the value of all payments for the total balance
  const paymentSum = payments.reduce((sum: number, payment: Payment) => +sum + +payment.value, 0.0);

  return (
    <div className="my-4 mx-4 sm:mx-24">
      <Head>
        <title>{household?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Error title="Failed to load household" error={error} />
      {loading && <LoadingAnimation />}
      {!loading && !household ? (
        <Alert message="Could not find this household." type="error" />
      ) : null}
      {!error && household && (
        <>
          <div className="text-6xl text-brand-500">{data.household.name}</div>
          <div className="mt-4 text-4xl">Total balance{' ' + roundOn2(paymentSum) + '€'}</div>
          {household.payments?.length === 0 ? (
            <Alert message="Could not find any payments." type="error" />
          ) : null}
          {household.recurringPayments?.length === 0 ? (
            <Alert message="Could not find any recurring payments." type="error" />
          ) : null}
          {household.thisMonthsPayments?.length === 0 ? (
            <Alert message="Could not find any payments this month." type="error" />
          ) : null}
          <Overview
            payments={household.payments}
            recurringPayments={household.recurringPayments}
            monthPayments={household.thisMonthsPayments}
          />
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
