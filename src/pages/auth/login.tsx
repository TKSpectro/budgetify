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

type Inputs = {
  email: string;
  password: string;
};

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Login() {
  const { refetch } = useQuery(ME_QUERY);
  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      // Just need to catch the error. The user gets feedback through the Error component
      try {
      } catch (error) {}
    },
    onCompleted: () => {
      // Refetch the user for the cache to get updated and then redirect to the homepage
      refetch();
      router.push('/');
    },
  });

  const router = useRouter();
  const form = useForm<Inputs>();

  function onSubmit(data: Inputs) {
    loginMutation({
      variables: {
        email: data.email,
        password: data.password,
      },
    });
  }

  return (
    <Container>
      <div className="mb-2">
        <Error title="Failed to login. Email or password is wrong!" error={error} />
      </div>

      <Form form={form} onSubmit={onSubmit}>
        <Input label="Email" type="email" {...form.register('email', {})} />

        <Input label="Password" type="password" {...form.register('password', {})} />

        <Button type="submit">Login</Button>
      </Form>

      <Link href="/auth/signup">No Account? No Problem! Signup</Link>
    </Container>
  );
}
