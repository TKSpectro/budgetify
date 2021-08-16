import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Overview from '~/components/Household/Overview';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HouseholdQuery = gql`
  query HouseholdQuery($householdId: String) {
    household(id: $householdId) {
      id
      name
      owner {
        firstname
        lastname
      }
      payments {
        id
        name
        value
        description
        category {
          id
          name
        }
        user {
          id
          firstname
          lastname
        }
      }
      recurringPayments {
        id
        name
        interval
        nextBooking
      }
    }
  }
`;

export default function Households() {
  const router = useRouter();
  const { householdId } = router.query;
  const { data, loading, error } = useQuery(HouseholdQuery, {
    variables: { householdId },
  });

  if (loading) return <span>loading...</span>;

  return (
    <div className="mx-24 mt-12">
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
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: HouseholdQuery,
    variables: { householdId: ctx.params!.householdId },
  });
};
