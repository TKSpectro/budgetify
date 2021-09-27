import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
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

export default function InviteManager({ invites, refetch }: Props) {
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

      <table className="table-fixed w-full break-words mt-4">
        <thead>
          <tr>
            <th className="w-1/3 hidden sm:table-cell">Email</th>
            <th className="w-1/3 hidden sm:table-cell">Expires</th>
            <th className="w-1/3 hidden sm:table-cell">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {invites.map((invite: Invite) => {
            return (
              <tr key={invite.id}>
                <td className="py-2">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {invite.invitedEmail}
                  </div>
                  <div className="block sm:hidden font-bold text-gray-800 dark:text-gray-100">
                    {new Date(invite.validUntil).toDateString()}
                  </div>
                  <div className="block sm:hidden font-bold text-gray-800 dark:text-gray-100">
                    <Modal
                      title="Remove invite"
                      description={`Are you sure that you want to remove the invite to ${invite.invitedEmail}?`}
                      onSubmit={() => removeHandler(invite)}
                      buttonText={<TrashIcon className="w-5 h-5" />}
                    />
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {new Date(invite.validUntil).toDateString()}
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <Modal
                    title="Remove invite"
                    description={`Are you sure that you want to remove the invite to ${invite.invitedEmail}?`}
                    onSubmit={() => removeHandler(invite)}
                    buttonText={<TrashIcon className="w-5 h-5" />}
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
