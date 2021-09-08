import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import GroupMemberTable from '~/components/Group/Manage/GroupMemberTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($groupId: String!) {
    group(id: $groupId) {
      id
      name
      value
      transactions {
        id
        name
        value
        participants {
          name
        }
      }
      owner {
        id
        name
      }
      members {
        id
        name
      }
    }
    calculateMemberBalances(id: $groupId) {
      name
      userId
      value
    }
  }
`;

export default function ManageGroup() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error } = useQuery(GROUP_QUERY, { variables: { groupId: groupId } });

  const group = data?.group;

  const members = group?.members;
  const owner = group?.owner;

  return (
    <Container>
      {loading && <LoadingAnimation />}
      <Error title="Could not load group." error={error} />

      {data && <GroupMemberTable members={members} owner={owner} />}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: GROUP_QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
