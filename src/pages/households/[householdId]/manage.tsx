import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import InviteManager from '~/components/Household/Manage/InviteManager';
import MemberTable from '~/components/Household/Manage/MemberTable';
import { Alert } from '~/components/UI/Alert';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String) {
    household(id: $householdId) {
      id
      name
      owner {
        id
        firstname
        lastname
      }
      members {
        id
        name
        email
      }
    }
  }
`;

export default function ManageHousehold() {
  const { data, loading, error } = useQuery(HOUSEHOLD_QUERY);

  const household = data?.household || {};
  const owner = household.owner || {};
  const members = household.members || [];

  return (
    <>
      <Head>
        <title>{'Manage ' + household.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container>
        <Error title="Failed to load household" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !household ? (
          <Alert message="Could not find this household." type="error" />
        ) : null}
        {!loading && !error && members && (
          <>
            <MemberTable members={members} owner={owner} />
          </>
        )}
      </Container>
      <Container>
        <Error title="Failed to load invites" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !household ? (
          <Alert message="Could not find this household." type="error" />
        ) : null}
        {!loading && !error && members && (
          <>
            <InviteManager />
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, ctx.query.householdId as string);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
    },
  });
};
