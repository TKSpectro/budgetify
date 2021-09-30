import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { ME_QUERY } from '~/components/UI/Header';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { MutationLoginArgs } from '~/graphql/__generated__/types';

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(email: $email, password: $password, isOTP: true) {
      token
    }
  }
`;

export default function OTPLogin() {
  const { refetch } = useQuery(ME_QUERY);
  const router = useRouter();

  const [loginMutation, { error }] = useMutation(LOGIN_MUTATION, {
    onError: () => {},
    onCompleted: async (data) => {
      await localStorage.setItem('token', data?.login?.token);
      await refetch();
      router.push('/auth/changePassword?isOTP=true');
    },
  });

  const loginForm = useForm<MutationLoginArgs>();

  function onSubmit() {
    loginMutation({
      variables: {
        ...loginForm.getValues(),
      },
    });
  }

  return (
    <Container>
      <div className="mb-2">
        <Error title="Failed to login. Email or password is wrong!" error={error} />
      </div>

      <Form form={loginForm} onSubmit={onSubmit}>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          {...loginForm.register('email', {
            required: { value: true, message: 'Email is required.' },
          })}
        />

        <Input
          label="One Time Password"
          type="password"
          autoComplete="one-time-code"
          {...loginForm.register('password', {
            required: { value: true, message: 'One Time Password is required.' },
          })}
        />

        <Button type="submit">Login</Button>
      </Form>

      <Link href="/auth/signup">No Account? No Problem! Signup</Link>
    </Container>
  );
}
