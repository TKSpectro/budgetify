import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ManagedModal } from '~/components/UI/ManagedModal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Invite } from '~/graphql/__generated__/types';
import {
  CreateInviteMutation,
  CreateInviteMutationVariables,
  DeleteInviteMutation,
  DeleteInviteMutationVariables,
} from './__generated__/InviteManager.generated';

const CREATE_INVITE_MUTATION = gql`
  mutation createInviteMutation($invitedEmail: String!, $householdId: String!) {
    createInvite(invitedEmail: $invitedEmail, householdId: $householdId) {
      id
    }
  }
`;

const DELETE_INVITE_MUTATION = gql`
  mutation deleteInviteMutation($id: String!) {
    deleteInvite(id: $id)
  }
`;

interface Props {
  invites: Invite[];
  refetch: () => void;
}

export default function InviteManager({ invites, refetch }: Props) {
  const router = useRouter();
  const form = useForm<CreateInviteMutationVariables>({
    defaultValues: { householdId: router.query.householdId as string, invitedEmail: '' },
  });

  const [createInviteMutation, { error: createInviteError }] = useMutation<
    CreateInviteMutation,
    CreateInviteMutationVariables
  >(CREATE_INVITE_MUTATION, {
    variables: {
      ...form.getValues(),
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {},
  });

  const [deleteInviteMutation, { error: deleteInviteError }] = useMutation<
    DeleteInviteMutation,
    DeleteInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {},
  });

  const onSubmitHandler = () => {
    createInviteMutation();
  };

  const [removeModalInvite, setRemoveModalInvite] = useState<Invite>();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const onRemoveClickHandler = (invite: Invite) => {
    setRemoveModalInvite(invite);
    setShowRemoveModal(true);
  };

  const removeHandler = () => {
    deleteInviteMutation({ variables: { id: removeModalInvite?.id || '' } });
  };

  return (
    <>
      <Error title="Could not create invite." error={createInviteError} />
      <Error title="Could not delete invite." error={deleteInviteError} />

      <ManagedModal
        title="Remove invite"
        description={`Are you sure that you want to remove the invite to ${removeModalInvite?.invitedEmail}?`}
        submitText={<TrashIcon className="w-6 h-6" />}
        onSubmit={() => {
          removeHandler();
        }}
        showModal={showRemoveModal}
        setShowModal={setShowRemoveModal}
      />

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
                    <Button onClick={() => onRemoveClickHandler(invite)}>
                      <TrashIcon className="w-6 h-6" />
                    </Button>
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {new Date(invite.validUntil).toDateString()}
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <Button onClick={() => onRemoveClickHandler(invite)}>
                    <TrashIcon className="w-6 h-6" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
