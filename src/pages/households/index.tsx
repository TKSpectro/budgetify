import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Container } from '~/components/UI/Container';
import { Household } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const query = gql`
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

export default function Households() {
  const { data, loading, error } = useQuery(query);
  if (loading) return <span>loading...</span>;

  // TODO: What info should be shown for each household?
  // Maybe even the net-value of the household?
  // Add a open button?

  return (
    <>
      {/* TODO: Use a Error message component for errors */}
      {error && <div>{JSON.stringify(error, null, 2)}</div>}
      <Container>
        {data.households.map((household: Household) => {
          return (
            <Link href={`/households/${household.id}`} key={household.id}>
              {/* TODO: fix last element should not have margin bottom */}
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
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: query,
  });
};
