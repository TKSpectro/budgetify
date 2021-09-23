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
import { MutationSignupArgs } from '~/graphql/__generated__/types';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $password: String!
    $firstname: String!
    $lastname: String!
  ) {
    signup(email: $email, password: $password, firstname: $firstname, lastname: $lastname) {
      token
    }
  }
`;

export default function Signup() {
  const { refetch } = useQuery(ME_QUERY);
  const router = useRouter();

  const [signupMutation, { error }] = useMutation(SIGNUP_MUTATION, {
    onError: () => {},
    onCompleted: () => {
      // Refetch the user for the cache to get updated and then redirect to the homepage
      refetch();
      router.push('/');
    },
  });

  const signupForm = useForm<MutationSignupArgs>();

  function onSubmit() {
    signupMutation({
      variables: { ...signupForm.getValues() },
    });
  }

  return (
    <Container>
      <div className="mb-2">
        <Error title="Failed to login. Email or password is wrong!" error={error} />
      </div>

      <Form form={signupForm} onSubmit={onSubmit}>
        <Input
          label="Firstname"
          type="text"
          {...signupForm.register('firstname', {
            required: { value: true, message: 'Firstname is required.' },
            maxLength: { value: 60, message: 'Firstname cant be longer than 60 characters.' },
          })}
        />

        <Input
          label="Lastname"
          type="text"
          {...signupForm.register('lastname', {
            required: { value: true, message: 'Lastname is required.' },
            maxLength: { value: 60, message: 'Lastname cant be longer than 60 characters.' },
          })}
        />

        <Input
          label="Email"
          type="email"
          {...signupForm.register('email', {
            required: { value: true, message: 'Email is required.' },
          })}
        />

        <Input
          label="Password"
          type="password"
          {...signupForm.register('password', {
            required: { value: true, message: 'Password is required.' },
            minLength: { value: 6, message: 'Password must be at least 6 characters.' },
          })}
        />

        <Button type="submit">Signup</Button>
      </Form>

      <Link href="/auth/login">Do you already have an account? Login</Link>
    </Container>
  );
}
