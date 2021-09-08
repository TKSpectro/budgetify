import { gql, useMutation } from '@apollo/client';
import { StarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Modal } from '~/components/UI/Modal';
import {
  MutationRemoveHouseholdMemberArgs,
  MutationUpdateHouseholdArgs,
  User,
} from '~/graphql/__generated__/types';

interface Props {
  members: User[];
  owner: User;
}

const UPDATE_HOUSEHOLD_MUTATION = gql`
  mutation UPDATE_OWNER_MUTATION($id: String!, $ownerId: String!) {
    updateHousehold(id: $id, ownerId: $ownerId) {
      id
      ownerId
    }
  }
`;

const REMOVE_HOUSEHOLD_MEMBER_MUTATION = gql`
  mutation REMOVE_HOUSEHOLD_MEMBER_MUTATION($id: String!, $memberId: String!) {
    removeHouseholdMember(id: $id, memberId: $memberId) {
      id
      members {
        id
      }
    }
  }
`;

export default function MemberTable({ members, owner, ...props }: Props) {
  const router = useRouter();
  const groupId = router.query.householdId as string;

  const [updateHouseholdMutation, { data, loading, error }] =
    useMutation<MutationUpdateHouseholdArgs>(UPDATE_HOUSEHOLD_MUTATION, {
      onCompleted: () => {},
      onError: () => {},
    });

  const [removeMemberMutation] = useMutation<MutationRemoveHouseholdMemberArgs>(
    REMOVE_HOUSEHOLD_MEMBER_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
    },
  );

  const makeOwnerHandler = (id: string) => {
    updateHouseholdMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeHandler = (id: string) => {
    removeMemberMutation({ variables: { id: groupId, memberId: id } });
  };

  return (
    <table className="w-full">
      <tbody className="divide-y divide-gray-200 ">
        {members.map((member: User) => {
          return (
            <tr key={member.id} className="">
              <td className="pl-4 py-4 w-1">
                {member.id === owner.id && (
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
                {owner.id !== member.id && (
                  <Modal
                    title="Remove user from household"
                    description={`Are you sure that you want to remove ${member.name} from this household?`}
                    onSubmit={() => removeHandler(member.id)}
                    buttonText="Remove"
                  />
                )}
              </td>
              <td className="py-4">
                {owner.id !== member.id && (
                  <Modal
                    title="Make owner of household"
                    description={`Are you sure that you want to make ${member.name} the new owner of this household?`}
                    onSubmit={() => makeOwnerHandler(member.id)}
                    buttonText="Make Owner"
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
