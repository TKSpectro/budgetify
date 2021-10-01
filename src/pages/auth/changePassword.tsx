import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import {
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
} from './__generated__/changePassword.generated';

const CHANGE_PASSWORD = gql`
  mutation changePasswordMutation($password: String!, $passwordRepeat: String!) {
    changePassword(password: $password, passwordRepeat: $passwordRepeat) {
      id
    }
  }
`;

export default function ChangePassword() {
  const router = useRouter();

  const [changePassword, { error }] = useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(CHANGE_PASSWORD, {
    onError: () => {},
    onCompleted: () => {
      router.push('/profile');
    },
  });

  const changePasswordForm = useForm<ChangePasswordMutationVariables>();

  function onSubmit() {
    changePassword({
      variables: {
        ...changePasswordForm.getValues(),
      },
    });
  }

  return (
    <Container>
      <Error title="Failed to change password." error={error} />

      {router?.query?.isOTP && (
        <div className="font-semibold text-lg mb-2">
          You just logged in with an one-time-password. Please change your password immediately.
        </div>
      )}

      <Form form={changePasswordForm} onSubmit={onSubmit}>
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...changePasswordForm.register('password', {
            required: { value: true, message: 'Password is required.' },
          })}
        />

        <Input
          label="Repeat Password"
          type="password"
          autoComplete="new-password"
          {...changePasswordForm.register('passwordRepeat', {
            required: { value: true, message: 'Repeat Password is required.' },
            validate: (value) =>
              value === changePasswordForm.getValues('password') || 'Passwords dont match.',
          })}
        />

        <Button type="submit">Change Password</Button>
      </Form>
    </Container>
  );
}
