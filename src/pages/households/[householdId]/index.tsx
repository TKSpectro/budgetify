import { gql, useQuery } from '@apollo/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Overview from '~/components/Household/Overview';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String, $startDate: String, $endDate: String) {
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
  const payments = data?.household?.payments || [];

  // Add up the value of all payments for the total balance
  const paymentSum = payments.reduce((sum: number, payment: Payment) => +sum + +payment.value, 0.0);

  const isOwner = household.owner.id === data?.me.id;

  return (
    <div className="my-4 mx-4 sm:mx-24">
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
          <div className=" relative text-6xl text-brand-500">
            {data.household.name}
            {isOwner && (
              <span className="absolute right-4 top-6 text-base">
                <Link href={router.asPath + '/manage'} asButton>
                  Manage
                </Link>
              </span>
            )}
          </div>

          <div className="mt-4 text-4xl">Total balance{' ' + roundOn2(paymentSum) + '€'}</div>

          {/* // TODO: Put these error into the specific containers and also always show them but 
              // if no data is passed they are just empty */}
          <Error
            title="Could not find any payments."
            error={household.payments?.length === 0 ? '' : undefined}
          />
          <Error
            title="Could not find any recurring payments."
            error={household.recurringPayments?.length === 0 ? '' : undefined}
          />
          <Error
            title="Could not find any payments this month."
            error={household.thisMonthsPayments?.length === 0 ? '' : undefined}
          />

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
