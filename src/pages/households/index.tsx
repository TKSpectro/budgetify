import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import React from 'react';
import { Container } from '~/components/UI/Container';
import { Household } from '~/graphql/__generated__/types';

const HouseholdsQuery = gql`
  query HouseholdsQuery {
    households {
      id
      name
      owner {
        firstname
        lastname
      }
    }
  }
`;

export default function Dashboard() {
  const { data, loading, error } = useQuery(HouseholdsQuery);

  if (loading) return <span>loading...</span>;

  // TODO: What info should be shown for each household?
  // Maybe even the net-value of the household?
  // Add a open button?

  return (
    <Container>
      {data.households.map((household: Household) => {
        return (
          <Link href={`/households/${household.id}`} key={household.id}>
            <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 rounded-lg hover:cursor-pointer">
              <div className="text-xl">{household.name}</div>
              <div>
                Owner: {household.owner?.firstname} {household.owner?.lastname}
              </div>
            </div>
          </Link>
        );
      })}
    </Container>
  );
}
