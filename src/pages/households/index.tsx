import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Alert } from '~/components/UI/Alert';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { Household } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HOUSEHOLD_LIST_QUERY = gql`
  query HOUSEHOLD_LIST_QUERY {
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
  const { data, loading, error } = useQuery(HOUSEHOLD_LIST_QUERY);
  if (loading) return <span>loading...</span>;

  const households = data?.households || [];

  // TODO: What info should be shown for each household?
  // Maybe even the net-value of the household?
  // Add a open button?

  return (
    <>
      <Head>
        <title>Dashboard | budgetify</title>
      </Head>
      <Container>
        <Error title="Failed to load recurring messages" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !error && households.length === 0 ? (
          <Alert message="Could not find any households. Please create or join one." type="error" />
        ) : null}
        {households?.map((household: Household) => {
          return (
            <Link href={`/households/${household.id}`} passHref key={household.id}>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
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
    query: HOUSEHOLD_LIST_QUERY,
  });
};
