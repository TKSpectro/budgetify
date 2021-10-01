import { gql, useMutation } from '@apollo/client';
import { StarIcon, UserRemoveIcon } from '@heroicons/react/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import {
  MutationAddGroupOwnerArgs,
  MutationRemoveGroupMemberArgs,
  User,
} from '~/graphql/__generated__/types';
import {
  RemoveGroupMemberMutation,
  RemoveGroupMemberMutationVariables,
  RemoveGroupOwnerMutation,
  RemoveGroupOwnerMutationVariables,
} from './__generated__/MemberTable.generated';

interface Props {
  members: User[];
  owners: User[];
  currentUserId: String;
}

const ADD_GROUP_OWNER_MUTATION = gql`
  mutation updateGroupOwnerMutation($id: String!, $ownerId: String!) {
    addGroupOwner(groupId: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_OWNER_MUTATION = gql`
  mutation removeGroupOwnerMutation($id: String!, $ownerId: String!) {
    removeGroupOwner(groupId: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_MEMBER_MUTATION = gql`
  mutation removeGroupMemberMutation($id: String!, $memberId: String!) {
    removeGroupMember(groupId: $id, memberId: $memberId) {
      id
      members {
        id
        name
      }
    }
  }
`;

export default function MemberTable({ members, owners, currentUserId }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [addGroupOwnerMutation] = useMutation<MutationAddGroupOwnerArgs>(ADD_GROUP_OWNER_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const [removeGroupOwnerMutation, { error: removeOwnerError }] = useMutation<
    RemoveGroupOwnerMutation,
    RemoveGroupOwnerMutationVariables
  >(REMOVE_GROUP_OWNER_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const [removeMemberMutation, { error: removeMemberError }] = useMutation<
    RemoveGroupMemberMutation,
    RemoveGroupMemberMutationVariables
  >(REMOVE_GROUP_MEMBER_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const [leaveGroupMutation, { error: leaveGroupError }] =
    useMutation<MutationRemoveGroupMemberArgs>(REMOVE_GROUP_MEMBER_MUTATION, {
      onCompleted: () => {
        router.push('/groups');
      },
      onError: () => {},
    });

  const makeOwnerHandler = (id: string) => {
    addGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeOwnerHandler = (id: string) => {
    removeGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeMemberHandler = (id: string) => {
    removeMemberMutation({ variables: { id: groupId, memberId: id } });
  };

  const leaveGroupHandler = (id: string) => {
    leaveGroupMutation({ variables: { id: groupId, memberId: id } });
  };

  return (
    <>
      <Error title="Could not remove owner." error={removeOwnerError} />
      <Error title="Could not remove member from group." error={removeMemberError} />
      <Error title="Could not leave group." error={leaveGroupError} />

      <table className="table-fixed w-full break-words">
        <thead>
          <tr>
            <th className="w-3/12">Name</th>
            <th className="w-3/12">Email</th>
            <th className="w-6/12">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {members.map((member: User) => {
            return (
              <tr key={member.id}>
                <td>
                  <div className="font-bold text-gray-800 dark:text-gray-100">{member.name}</div>
                </td>
                <td>
                  <div className="font-bold text-gray-800 dark:text-gray-100">{member.email}</div>
                </td>
                <td>
                  {member.id !== currentUserId ? (
                    <Modal
                      title="Remove user from group"
                      description={`Are you sure that you want to remove ${member.name} from this group?`}
                      onSubmit={() => removeMemberHandler(member.id)}
                      buttonText={<UserRemoveIcon className="w-6 h-6" />}
                      buttonClassName="mr-2"
                    />
                  ) : (
                    <Modal
                      title="Leave group."
                      description={`Are you sure that you want to remove ${member.name} from this group?`}
                      onSubmit={() => leaveGroupHandler(member.id)}
                      buttonText={<UserRemoveIcon className="w-6 h-6" />}
                      buttonClassName="mr-2"
                    />
                  )}
                  {!owners.find((x) => x.id === member.id) ? (
                    <Modal
                      title="Give owner role"
                      description={`Are you sure that you want to make ${member.name} a owner of this group?`}
                      onSubmit={() => makeOwnerHandler(member.id)}
                      buttonText={<StarIcon className="w-6 h-6" />}
                    />
                  ) : (
                    <Modal
                      title="Remove owner role"
                      description={`Are you sure that you want to remove ${member.name} from the owners?`}
                      onSubmit={() => removeOwnerHandler(member.id)}
                      buttonText={<StarIconSolid className="w-6 h-6" />}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
