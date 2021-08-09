import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { preloadQuery } from '~/utils/apollo';

const HouseholdQuery = gql`
  query HouseholdQuery($householdId: String) {
    household(id: $householdId) {
      id
      name
      owner {
        firstname
        lastname
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
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: HouseholdQuery,
    variables: { householdId: ctx.params!.householdId },
  });
