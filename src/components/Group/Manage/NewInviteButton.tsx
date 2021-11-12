import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  CreateGroupInviteMutation,
  CreateGroupInviteMutationVariables,
} from './__generated__/NewInviteButton.generated';

const CREATE_INVITE_MUTATION = gql`
  mutation createGroupInviteMutation($invitedEmail: String!, $groupId: String!) {
    createGroupInvite(invitedEmail: $invitedEmail, groupId: $groupId) {
      id
    }
  }
`;

interface Props {
  t: TFunction;
  groupId: string;
  refetch: () => void;
}

export function NewInviteButton({ t, groupId, refetch }: Props) {
  const form = useForm<CreateGroupInviteMutationVariables>({
    defaultValues: { groupId: groupId, invitedEmail: '' },
  });

  const [createInvite, { error: createInviteError }] = useMutation<
    CreateGroupInviteMutation,
    CreateGroupInviteMutationVariables
  >(CREATE_INVITE_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmitHandler = () => {
    createInvite({ variables: { ...form.getValues() } });
  };

  return (
    <>
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
    </>
  );
}
