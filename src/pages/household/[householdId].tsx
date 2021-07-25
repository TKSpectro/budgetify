import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';

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

export default function Dashboard() {
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

// TODO: Figure out how to server side this

// export async function getServerSideProps() {
//   const client = initializeApollo();
//   const { data, error } = await client.query({
//     query: gql`
//       query HouseholdQuery {
//         household(id: "3d18f195-d179-400d-a6bc-c4d9c544f9ac") {
//           id
//           name
//           owner {
//             firstname
//             lastname
//           }
//         }
//       }
//     `,
//   });

//   return {
//     props: {
//       household: data.household,
//       error: error || null,
//     },
//   };
// }
