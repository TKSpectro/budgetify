import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Invite } from '~/graphql/__generated__/types';
import {
  CreateGroupInviteMutation,
  CreateGroupInviteMutationVariables,
  DeleteGroupInviteMutation,
  DeleteGroupInviteMutationVariables,
} from './__generated__/InviteManager.generated';

interface Props {
  invites: Invite[];
}

const CREATE_INVITE_MUTATION = gql`
  mutation createGroupInviteMutation($invitedEmail: String!, $groupId: String!) {
    createGroupInvite(invitedEmail: $invitedEmail, groupId: $groupId) {
      id
    }
  }
`;

const DELETE_INVITE_MUTATION = gql`
  mutation deleteGroupInviteMutation($id: String!) {
    deleteInvite(id: $id)
  }
`;

export function InviteManager({ invites }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const form = useForm<CreateGroupInviteMutationVariables>({
    defaultValues: { groupId: groupId, invitedEmail: '' },
  });

  const [deleteInvite, { error: deleteInviteError }] = useMutation<
    DeleteGroupInviteMutation,
    DeleteGroupInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
    refetchQueries: ['GROUP_MANAGE_QUERY'],
  });

  const [createInvite, { error: createInviteError }] = useMutation<
    CreateGroupInviteMutation,
    CreateGroupInviteMutationVariables
  >(CREATE_INVITE_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
    refetchQueries: ['GROUP_MANAGE_QUERY'],
  });

  const removeHandler = (invite: Invite) => {
    deleteInvite({ variables: { id: invite.id } });
  };

  const onSubmitHandler = () => {
    createInvite({ variables: { ...form.getValues() } });
  };

  return (
    <>
      <Error title="Could not remove invite." error={deleteInviteError} />
      <Error title="Could not create invite." error={createInviteError} />
      <ModalForm
        title="New Invite"
        onSubmit={onSubmitHandler}
        submitText="Send invite"
        buttonText="New Invite"
        form={form}
      >
        <Input
          label="Invited Email"
          type="email"
          {...form.register('invitedEmail', {
            required: { value: true, message: 'Invited Email is required.' },
          })}
        />
      </ModalForm>

      {invites.length !== 0 ? (
        <table className="w-full">
          <tbody className="divide-y divide-gray-200 ">
            {invites.map((invite: Invite) => {
              return (
                <tr key={invite.id} className="">
                  <td className="py-4">
                    <div className="max-w-xl ml-2 overflow-auto">
                      <div className="font-bold text-gray-800 dark:text-gray-100">
                        {invite.invitedEmail}
                      </div>
                      <div className="table-cell sm:hidden  font-bold text-gray-800 dark:text-gray-100">
                        {new Date(invite.validUntil).toDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <div className="max-w-xl overflow-auto">
                      <div className="ml-2 font-bold text-gray-800 dark:text-gray-100">
                        {new Date(invite.validUntil).toDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 mr-4 float-right">
                    <Modal
                      title="Remove user from household"
                      description={`Are you sure that you want to remove the invite to ${invite.invitedEmail}?`}
                      onSubmit={() => removeHandler(invite)}
                      buttonText="Remove"
                      submitText="Remove Invite"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
