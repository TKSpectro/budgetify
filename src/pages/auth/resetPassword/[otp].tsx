import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { MutationResetPasswordArgs } from '~/graphql/__generated__/types';

const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($email: String!, $otp: String!, $password: String!) {
    resetPassword(email: $email, otp: $otp, password: $password) {
      id
    }
  }
`;

export default function ResetPassword() {
  const router = useRouter();
  const { otp } = router.query;

  const [resetPassword, { data, error }] = useMutation(RESET_PASSWORD, {
    onError: () => {},
    onCompleted: () => {
      // Refetch the user for the cache to get updated and then redirect to the homepage
      router.push('/auth/login');
    },
  });

  const resetPasswordForm = useForm<MutationResetPasswordArgs>();

  function onSubmit() {
    resetPassword({
      variables: {
        ...resetPasswordForm.getValues(),
        otp,
      },
    });
  }

  return (
    <Container>
      <Error title="Failed to reset password." error={error} />

      {/* // TODO: Started with this maybe dont even let the user put his email */}
      <Form form={resetPasswordForm} onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          {...resetPasswordForm.register('email', {
            required: { value: true, message: 'Email is required.' },
          })}
        />

        <Input
          label="Password"
          type="password"
          {...resetPasswordForm.register('password', {
            required: { value: true, message: 'Password is required.' },
          })}
        />

        <Button type="submit">Login</Button>
      </Form>

      <Link href="/auth/signup">No Account? No Problem! Signup</Link>
    </Container>
  );
}
