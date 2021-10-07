import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
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
  isOwner: boolean;
  refetch: () => void;
  t: TFunction;
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

export function InviteManager({ invites, isOwner, refetch, t }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const form = useForm<CreateGroupInviteMutationVariables>({
    defaultValues: { groupId: groupId, invitedEmail: '' },
  });

  const [deleteInvite, { error: deleteInviteError }] = useMutation<
    DeleteGroupInviteMutation,
    DeleteGroupInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [createInvite, { error: createInviteError }] = useMutation<
    CreateGroupInviteMutation,
    CreateGroupInviteMutationVariables
  >(CREATE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const removeHandler = (invite: Invite) => {
    deleteInvite({ variables: { id: invite.id } });
  };

  const onSubmitHandler = () => {
    createInvite({ variables: { ...form.getValues() } });
  };

  return (
    <>
      <Error title={t('removeInviteError')} error={deleteInviteError} />
      <Error title={t('createInviteError')} error={createInviteError} />

      {isOwner && (
        <ModalForm
          title={t('createInvite')}
          onSubmit={onSubmitHandler}
          submitText={t('sendInvite')}
          buttonText={t('createInvite')}
          form={form}
        >
          <Input
            label={t('common:email')}
            type="email"
            {...form.register('invitedEmail', {
              required: { value: true, message: t('createInviteEmailMessage') },
            })}
          />
        </ModalForm>
      )}

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
                    {isOwner && (
                      <Modal
                        title={t('removeInvite')}
                        description={t('removeInviteDescription', { email: invite.invitedEmail })}
                        onSubmit={() => removeHandler(invite)}
                        buttonText={<TrashIcon className="w-6 h-6" />}
                        submitText={t('removeInvite')}
                      />
                    )}
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
