import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { MutationCreateInviteArgs } from '~/graphql/__generated__/types';

const CREATE_INVITE_MUTATION = gql`
  mutation CreateInvite($invitedEmail: String!, $householdId: String!) {
    createInvite(invitedEmail: $invitedEmail, householdId: $householdId) {
      id
    }
  }
`;

export default function NewInvite() {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<MutationCreateInviteArgs>();

  const [createInviteMutation, { data, error }] = useMutation(CREATE_INVITE_MUTATION, {
    onError: (error) => {
      try {
      } catch (error) {
        console.error(error);
      }
    },
  });

  if (data) {
    const returnUrl = router.asPath.substring(0, router.asPath.lastIndexOf('/'));
    setTimeout(() => {
      router.push(returnUrl);
    }, 2000);
    return (
      <Container>
        Created new invite. You will get redirected shortly!
        <br />
        <Link href={returnUrl}>If not. Click here</Link>
      </Container>
    );
  }

  const onSubmitHandler = (data: MutationCreateInviteArgs) => {
    console.log(data);
    createInviteMutation({
      variables: {
        ...form.getValues(),
        householdId,
      },
    });
  };

  return (
    <Container>
      <Error title="Failed to load household" error={error} />

      <Form form={form} onSubmit={onSubmitHandler}>
        <Input
          label="Invited Email"
          type="email"
          {...form.register('invitedEmail', { required: true })}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}
