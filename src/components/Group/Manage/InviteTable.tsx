import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import { Invite } from '~/graphql/__generated__/types';
import {
  DeleteGroupInviteMutation,
  DeleteGroupInviteMutationVariables,
} from './__generated__/InviteTable.generated';

interface Props {
  invites: Invite[];
  isOwner: boolean;
  refetch: () => void;
  t: TFunction;
}

const DELETE_INVITE_MUTATION = gql`
  mutation deleteGroupInviteMutation($id: String!) {
    deleteInvite(id: $id)
  }
`;

export function InviteTable({ invites, isOwner, refetch, t }: Props) {
  const [deleteInvite, { error: deleteInviteError }] = useMutation<
    DeleteGroupInviteMutation,
    DeleteGroupInviteMutationVariables
  >(DELETE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const removeHandler = (invite: Invite) => {
    deleteInvite({ variables: { id: invite.id } });
  };

  return (
    <>
      <Error title={t('removeInviteError')} error={deleteInviteError} className="mt-4" />

      {invites.length !== 0 ? (
        <table className="table-fixed w-full break-words mt-4 text-center">
          <thead>
            <tr>
              <th className="w-1/3 hidden sm:table-cell">{t('common:email')}</th>
              <th className="w-1/3 hidden sm:table-cell">{t('common:expires')}</th>
              <th className="w-1/3 hidden sm:table-cell">{t('common:actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {invites.map((invite: Invite) => {
              return (
                <tr key={invite.id}>
                  <td className="py-2 sm:py-4">
                    <div className=" text-gray-800 dark:text-gray-100 hidden sm:block">
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
                          <Modal
                            title={t('removeInvite')}
                            description={t('removeInviteDescription', {
                              email: invite.invitedEmail,
                            })}
                            onSubmit={() => removeHandler(invite)}
                            buttonText={<TrashIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
                            submitText={t('removeInvite')}
                          />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <div className="max-w-xl overflow-auto">
                      <div className="ml-2  text-gray-800 dark:text-gray-100">
                        {new Date(invite.validUntil).toDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    {isOwner && (
                      <Modal
                        title={t('removeInvite')}
                        description={t('removeInviteDescription', { email: invite.invitedEmail })}
                        onSubmit={() => removeHandler(invite)}
                        buttonText={<TrashIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
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
