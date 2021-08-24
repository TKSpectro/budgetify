import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
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
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
    signup(email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
      token
    }
  }
`;

export default function Signup() {
  const { refetch } = useQuery(ME_QUERY);
  const [signupMutation, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
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
    signupMutation({
      variables: {
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
      },
    });
  }

  return (
    <Container>
      <div className="mb-2">
        <Error title="Failed to login. Email or password is wrong!" error={error} />
      </div>

      <Form form={form} onSubmit={onSubmit}>
        <Input
          label="Firstname"
          type="text"
          {...form.register('firstname', { required: true, maxLength: 60 })}
        />

        <Input
          label="Lastname"
          type="text"
          {...form.register('lastname', { required: true, maxLength: 60 })}
        />

        <Input label="Email" type="email" {...form.register('email', { required: true })} />

        <Input
          label="Password"
          type="password"
          {...form.register('password', { required: true, minLength: 6 })}
        />

        <Button type="submit">Signup</Button>
      </Form>

      <Link href="/auth/login">Do you already have an account? Login</Link>
    </Container>
  );
}
