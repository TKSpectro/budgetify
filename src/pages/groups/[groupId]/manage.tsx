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
    me {
      id
    }
    group(id: $groupId) {
      id
      name
      value
      owners {
        id
        name
      }
      members {
        id
        name
      }
    }
  }
`;

export default function ManageGroup() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error } = useQuery(GROUP_QUERY, { variables: { groupId: groupId } });

  const currentUserId = data?.me.id;
  const group = data?.group;

  const members = group?.members;
  const owners = group?.owners;

  return (
    <Container>
      {loading && <LoadingAnimation />}
      <Error title="Could not load group." error={error} />

      {data && <GroupMemberTable members={members} owners={owners} currentUserId={currentUserId} />}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, undefined, ctx.query.groupId as string);
  return preloadQuery(ctx, {
    query: GROUP_QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
