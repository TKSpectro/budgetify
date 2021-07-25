import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { CustomLink } from '~/components/UI/CustomLink';
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

  // TODO: build nice looking custom component for one household-list-item thing
  return (
    <div>
      {data.households.map((household: Household) => {
        return (
          <div key={household.id}>
            <CustomLink href={`/household/${household.id}`}>{household.name}</CustomLink>
          </div>
        );
      })}
    </div>
  );
}
