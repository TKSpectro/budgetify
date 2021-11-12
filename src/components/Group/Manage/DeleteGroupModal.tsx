import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import { urlOneUp } from '~/utils/helper';
import {
  DeleteGroupMutation,
  DeleteGroupMutationVariables,
} from './__generated__/DeleteGroupModal.generated';

const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroupMutation($id: String!) {
    deleteGroup(groupId: $id) {
      id
    }
  }
`;

interface Props {
  groupId: string;
  t: TFunction;
}
export function DeleteGroupModal({ groupId, t }: Props) {
  const router = useRouter();

  const [deleteGroup, { error: deleteGroupError }] = useMutation<
    DeleteGroupMutation,
    DeleteGroupMutationVariables
  >(DELETE_GROUP_MUTATION, {
    onCompleted: () => {
      // If a group gets deleted we need to redirect from /groups/:id/manage to /groups
      router.push(urlOneUp(urlOneUp(router.asPath)));
    },
    onError: () => {},
  });

  const deleteGroupHandler = () => {
    deleteGroup({ variables: { id: groupId } });
  };
  return (
    <>
      <Error title={t('deleteGroupError')} error={deleteGroupError} />
      <Modal
        buttonText={t('deleteGroup')}
        buttonClassName="bg-red-500 mt-4"
        description={t('deleteGroupDescription')}
        onSubmit={deleteGroupHandler}
        title={t('deleteGroup')}
        submitText={<TrashIcon className="w-6 h-6" />}
      />
    </>
  );
}
