import { gql, useMutation } from '@apollo/client';
import { StarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import {
  MutationAddGroupOwnerArgs,
  MutationRemoveGroupMemberArgs,
  MutationRemoveGroupOwnerArgs,
  User,
} from '~/graphql/__generated__/types';

interface Props {
  members: User[];
  owners: User[];
  currentUserId: String;
}

const ADD_GROUP_OWNER_MUTATION = gql`
  mutation UPDATE_GROUP_OWNER_MUTATION($id: String!, $ownerId: String!) {
    addGroupOwner(id: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_OWNER_MUTATION = gql`
  mutation REMOVE_GROUP_OWNER_MUTATION($id: String!, $ownerId: String!) {
    removeGroupOwner(id: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_MEMBER_MUTATION = gql`
  mutation REMOVE_GROUP_MEMBER_MUTATION($id: String!, $memberId: String!) {
    removeGroupMember(id: $id, memberId: $memberId) {
      id
      members {
        id
      }
    }
  }
`;

export default function GroupMemberTable({ members, owners, currentUserId, ...props }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [addGroupOwnerMutation] = useMutation<MutationAddGroupOwnerArgs>(ADD_GROUP_OWNER_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const [removeGroupOwnerMutation, { error: removeOwnerError }] =
    useMutation<MutationRemoveGroupOwnerArgs>(REMOVE_GROUP_OWNER_MUTATION, {
      onCompleted: () => {},
      onError: () => {},
    });

  const [removeMemberMutation] = useMutation<MutationRemoveGroupMemberArgs>(
    REMOVE_GROUP_MEMBER_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
    },
  );

  const makeOwnerHandler = (id: string) => {
    addGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeOwnerHandler = (id: string) => {
    removeGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeHandler = (id: string) => {
    removeMemberMutation({ variables: { id: groupId, memberId: id } });
  };

  return (
    <>
      <Error title="Could not remove owner." error={removeOwnerError} />
      <table className="w-full">
        <tbody className="divide-y divide-gray-200 ">
          {members.map((member: User) => {
            return (
              <tr key={member.id} className="">
                <td className="pl-4 py-4 w-1">
                  {!!owners.find((x) => x.id === member.id) && (
                    <StarIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />
                  )}
                </td>
                <td className="py-4">
                  <div className="max-w-xl overflow-auto">
                    <div className="ml-2 font-bold text-gray-800 dark:text-gray-100">
                      {member.name}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="max-w-xl overflow-auto">
                    <div className="ml-2 font-bold text-gray-800 dark:text-gray-100">
                      {member.email}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  {/* // TODO: Implement leave button for the own user */}
                  {member.id !== currentUserId && (
                    <Modal
                      title="Remove user from household"
                      description={`Are you sure that you want to remove ${member.name} from this household?`}
                      onSubmit={() => removeHandler(member.id)}
                      buttonText="Remove"
                    />
                  )}
                </td>
                <td className="py-4">
                  {!owners.find((x) => x.id === member.id) && (
                    <Modal
                      title="Make owner of household"
                      description={`Are you sure that you want to make ${member.name} a owner of this group?`}
                      onSubmit={() => makeOwnerHandler(member.id)}
                      buttonText="Make Owner"
                    />
                  )}
                  {!!owners.find((x) => x.id === member.id) && (
                    <Modal
                      title="Remove owner role"
                      description={`Are you sure that you want to remove ${member.name} from the owners?`}
                      onSubmit={() => removeOwnerHandler(member.id)}
                      buttonText="Remove Owner"
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
