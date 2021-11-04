import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ManagedModal } from '~/components/UI/ManagedModal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Invite, User } from '~/graphql/__generated__/types';
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
  owner: User;
  currentUserId: string;
  refetch: () => void;
  t: TFunction;
}

export default function InviteManager({ invites, owner, currentUserId, refetch, t }: Props) {
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
    onError: () => {},
  });

  const [deleteInviteMutation, { error: deleteInviteError }] = useMutation<
    DeleteInviteMutation,
    DeleteInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
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
      <Error title={t('createInviteError')} error={createInviteError} className="mt-4" />
      <Error title={t('removeInviteError')} error={deleteInviteError} className="mt-4" />

      <ManagedModal
        title={t('removeInvite')}
        description={t('removeInviteDescription', { email: removeModalInvite?.invitedEmail })}
        submitText={<TrashIcon className="w-6 h-6" />}
        onSubmit={() => {
          removeHandler();
        }}
        showModal={showRemoveModal}
        setShowModal={setShowRemoveModal}
      />

      {currentUserId === owner?.id && (
        <ModalForm
          title={t('newInvite')}
          onSubmit={onSubmitHandler}
          submitText={t('sendInvite')}
          buttonText={t('newInvite')}
          form={form}
        >
          <Input
            label={t('common:email')}
            type="email"
            {...form.register('invitedEmail', { required: true })}
          />
        </ModalForm>
      )}
      {invites.length !== 0 ? (
        <table className="table-fixed w-full break-words mt-4">
          <thead>
            <tr>
              <th className="w-1/3 hidden sm:table-cell">{t('common:email')}</th>
              <th className="w-1/3 hidden sm:table-cell">{t('common:expires')}</th>
              <th className="w-1/3 hidden sm:table-cell">{t('common:actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center">
            {invites.map((invite: Invite) => {
              return (
                <tr key={invite.id}>
                  <td className="py-2">
                    <div className="text-gray-800 dark:text-gray-100 hidden sm:block">
                      {invite.invitedEmail}
                    </div>
                    <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                      {t('common:email')}
                      <span className="float-right font-normal">{invite.invitedEmail}</span>
                    </div>
                    <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                      {t('common:expires')}
                      <span className="float-right font-normal">
                        {new Date(invite.validUntil).toDateString()}
                      </span>
                    </div>
                    <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                      {t('common:actions')}
                      <span className="float-right font-normal">
                        {currentUserId === owner?.id && (
                          <Button onClick={() => onRemoveClickHandler(invite)}>
                            <TrashIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                          </Button>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <div className="text-gray-800 dark:text-gray-100">
                      {new Date(invite.validUntil).toDateString()}
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    {currentUserId === owner?.id && (
                      <Button onClick={() => onRemoveClickHandler(invite)}>
                        <TrashIcon className="w-6 h-6" />
                      </Button>
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
