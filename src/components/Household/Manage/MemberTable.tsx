import { gql, useMutation } from '@apollo/client';
import { StarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
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
    updateHousehold(householdId: $id, ownerId: $ownerId) {
      id
      ownerId
    }
  }
`;

const REMOVE_HOUSEHOLD_MEMBER_MUTATION = gql`
  mutation REMOVE_HOUSEHOLD_MEMBER_MUTATION($id: String!, $memberId: String!) {
    removeHouseholdMember(householdId: $id, memberId: $memberId) {
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

  const leaveHouseholdForm = useForm();

  const [updateHouseholdMutation, { error: updateHouseholdError }] =
    useMutation<MutationUpdateHouseholdArgs>(UPDATE_HOUSEHOLD_MUTATION, {
      onCompleted: () => {},
      onError: () => {},
    });

  const [removeMemberMutation, { error: removeMemberError }] =
    useMutation<MutationRemoveHouseholdMemberArgs>(REMOVE_HOUSEHOLD_MEMBER_MUTATION, {
      onCompleted: () => {},
      onError: () => {},
    });

  const makeOwnerHandler = (id: string) => {
    updateHouseholdMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeHandler = (id: string) => {
    removeMemberMutation({ variables: { id: groupId, memberId: id } });
  };

  const onLeaveSubmit = async () => {
    await removeMemberMutation({ variables: { id: groupId, memberId: owner.id } });
    const { errors } = await updateHouseholdMutation({
      variables: { id: groupId, ownerId: leaveHouseholdForm.getValues('ownerId') },
    });

    if (!errors) router.push('/households');
  };

  return (
    <>
      <Error title="Could not update household." error={updateHouseholdError} />
      <Error title="Could not remove member." error={removeMemberError} />

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
                  {owner.id !== member.id ? (
                    <Modal
                      title="Remove user from household"
                      description={`Are you sure that you want to remove ${member.name} from this household?`}
                      onSubmit={() => removeHandler(member.id)}
                      buttonText="Remove"
                    />
                  ) : (
                    <ModalForm
                      form={leaveHouseholdForm}
                      onSubmit={onLeaveSubmit}
                      title="Leave household"
                      buttonText="Leave"
                    >
                      <label>
                        New Owner
                        <select
                          className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                          {...leaveHouseholdForm.register('ownerId', {
                            required: { value: true, message: 'Please select the new owner.' },
                          })}
                        >
                          {members.map((member) => {
                            if (member.id !== owner.id) {
                              return (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </select>
                      </label>
                    </ModalForm>
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
    </>
  );
}
