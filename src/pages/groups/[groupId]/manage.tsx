import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import GroupMemberTable from '~/components/Group/Manage/GroupMemberTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!) {
    me {
      id
    }
    group(id: $id) {
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

const DELETE_GROUP_MUTATION = gql`
  mutation ($id: String!) {
    deleteGroup(id: $id) {
      id
    }
  }
`;

export default function ManageGroup() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error } = useQuery(GROUP_QUERY, { variables: { id: groupId } });

  const [deleteGroup, { error: deleteGroupError }] = useMutation(DELETE_GROUP_MUTATION, {
    onCompleted: () => {
      let goUpOne = router.asPath.substring(0, router.asPath.lastIndexOf('/'));
      router.push(goUpOne.substring(0, goUpOne.lastIndexOf('/')));
    },
    onError: () => {},
  });

  const currentUserId = data?.me.id;
  const group = data?.group;

  const members = group?.members;
  const owners = group?.owners;

  const deleteGroupHandler = () => {
    deleteGroup({ variables: { id: groupId } });
  };

  return (
    <Container>
      <Error title="Could not load group." error={error} />
      <Error title="Could not delete group." error={deleteGroupError} />
      <Loader loading={loading} />

      {data && <GroupMemberTable members={members} owners={owners} currentUserId={currentUserId} />}
      <Modal
        buttonText="Delete Group"
        buttonClassName="bg-red-500 mt-4"
        description="Are you sure that you want to delete this group"
        onSubmit={deleteGroupHandler}
        title="Delete Group"
      />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, {
    CHECK_GROUP_OWNER: ctx.query.groupId as string,
  });
  return preloadQuery(ctx, {
    query: GROUP_QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
