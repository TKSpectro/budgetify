import { gql, useMutation, useQuery } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { InviteManager } from '~/components/Group/Manage/InviteManager';
import MemberTable from '~/components/Group/Manage/MemberTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { Invite, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { urlOneUp } from '~/utils/helper';
import {
  DeleteGroupMutation,
  DeleteGroupMutationVariables,
  GroupManageQuery,
  GroupManageQueryVariables,
} from './__generated__/manage.generated';

const QUERY = gql`
  query groupManageQuery($id: String!) {
    me {
      id
    }
    group(groupId: $id) {
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
        email
      }
      invites {
        id
        invitedEmail
        validUntil
      }
    }
  }
`;

const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroupMutation($id: String!) {
    deleteGroup(groupId: $id) {
      id
    }
  }
`;

export default function ManageGroup() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error } = useQuery<GroupManageQuery, GroupManageQueryVariables>(QUERY, {
    variables: { id: groupId },
  });

  const [deleteGroup, { error: deleteGroupError }] = useMutation<
    DeleteGroupMutation,
    DeleteGroupMutationVariables
  >(DELETE_GROUP_MUTATION, {
    onCompleted: () => {
      router.push(urlOneUp(urlOneUp(router.asPath)));
    },
    onError: () => {},
  });

  const currentUserId = data?.me?.id;
  const group = data?.group;

  const members = group?.members || [];
  const owners = group?.owners || [];
  const invites = group?.invites || [];

  const deleteGroupHandler = () => {
    deleteGroup({ variables: { id: groupId } });
  };

  return (
    <>
      <Container big>
        <Error title="Could not load group." error={error} />
        <Error title="Could not delete group." error={deleteGroupError} />
        <Loader loading={loading} />

        {data && (
          <MemberTable
            members={members as User[]}
            owners={owners as User[]}
            currentUserId={currentUserId as string}
          />
        )}
        <Modal
          buttonText="Delete Group"
          buttonClassName="bg-red-500 mt-4"
          description="Are you sure that you want to delete this group"
          onSubmit={deleteGroupHandler}
          title="Delete Group"
          submitText={<TrashIcon className="w-6 h-6" />}
        />
      </Container>

      <Container>
        <Loader loading={loading} />
        <InviteManager invites={invites as Invite[]} />
        <Error title="No pending invites." error={invites.length === 0 ? '' : undefined} />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, {
    CHECK_GROUP_OWNER: ctx.query.groupId as string,
  });
  return preloadQuery(ctx, {
    query: QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
