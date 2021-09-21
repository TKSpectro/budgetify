import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Invite, MutationCreateInviteArgs } from '~/graphql/__generated__/types';

const CREATE_INVITE_MUTATION = gql`
  mutation CreateInvite($invitedEmail: String!, $householdId: String!) {
    createInvite(invitedEmail: $invitedEmail, householdId: $householdId) {
      id
    }
  }
`;

const DELETE_INVITE_MUTATION = gql`
  mutation DeleteInvite($id: String!) {
    deleteInvite(id: $id)
  }
`;

interface Props {
  invites: Invite[];
  refetch: () => void;
}

export default function InviteManager({ invites, refetch, ...props }: Props) {
  const router = useRouter();
  const form = useForm<MutationCreateInviteArgs>({
    defaultValues: { householdId: router.query.householdId as string, invitedEmail: '' },
  });

  const [createInviteMutation, { error: createInviteError }] = useMutation(CREATE_INVITE_MUTATION, {
    variables: {
      ...form.getValues(),
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {},
  });

  const [deleteInviteMutation, { error: deleteInviteError }] = useMutation(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {},
  });

  const onSubmitHandler = () => {
    createInviteMutation();
  };

  const removeHandler = (invite: Invite) => {
    deleteInviteMutation({ variables: { id: invite.id } });
  };

  return (
    <>
      <Error title="Could not create invite." error={createInviteError} />
      <Error title="Could not delete invite." error={deleteInviteError} />

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
          {...form.register('invitedEmail', { required: true })}
        />
      </ModalForm>

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
    </>
  );
}
