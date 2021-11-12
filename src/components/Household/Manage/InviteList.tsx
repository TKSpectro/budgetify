import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useState } from 'react';
import { Button } from '~/components/UI/Button';
import { Error } from '~/components/UI/Error';
import { ManagedModal } from '~/components/UI/ManagedModal';
import { Invite } from '~/graphql/__generated__/types';
import {
  DeleteInviteMutation,
  DeleteInviteMutationVariables,
} from './__generated__/InviteList.generated';

const DELETE_INVITE_MUTATION = gql`
  mutation deleteInviteMutation($id: String!) {
    deleteInvite(id: $id)
  }
`;

interface Props {
  invites: Invite[];
  isOwner: boolean;
  currentUserId: string;
  refetch: () => void;
  t: TFunction;
}

export default function InviteList({ invites, isOwner, currentUserId, refetch, t }: Props) {
  const [deleteInviteMutation, { error: deleteInviteError }] = useMutation<
    DeleteInviteMutation,
    DeleteInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

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
                        {isOwner && (
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
                    {isOwner && (
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
