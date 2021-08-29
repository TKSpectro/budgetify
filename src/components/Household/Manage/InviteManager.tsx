import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import { Invite, MutationCreateInviteArgs } from '~/graphql/__generated__/types';

const CREATE_INVITE_MUTATION = gql`
  mutation CreateInvite($invitedEmail: String!, $householdId: String!) {
    createInvite(invitedEmail: $invitedEmail, householdId: $householdId) {
      id
    }
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

  const [createInviteMutation, { data, error }] = useMutation(CREATE_INVITE_MUTATION, {
    variables: {
      ...form.getValues(),
    },
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {},
  });

  const onSubmitHandler = () => {
    createInviteMutation();
  };

  return (
    <>
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
      {/* <Link href={router.asPath + '/invite'} asButton>
        New Invite
      </Link> */}
      <div className="mt-4">
        {invites.map((invite) => {
          return (
            <div key={invite.id}>
              <div>{invite.invitedEmail}</div>
              <div>{invite.validUntil}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
