import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  CreateInviteMutation,
  CreateInviteMutationVariables,
} from './__generated__/NewInviteModal.generated';

const CREATE_INVITE_MUTATION = gql`
  mutation createInviteMutation($invitedEmail: String!, $householdId: String!) {
    createInvite(invitedEmail: $invitedEmail, householdId: $householdId) {
      id
    }
  }
`;

interface Props {
  refetch: () => void;
  t: TFunction;
}

export function NewInviteModal({ refetch, t }: Props) {
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

  const onSubmitHandler = () => {
    createInviteMutation();
  };

  return (
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
  );
}
