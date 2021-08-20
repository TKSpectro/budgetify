import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { CustomLink } from '~/components/UI/CustomLink';
import { Form } from '~/components/UI/Form';
import { ME_QUERY } from '~/components/UI/Header';
import { Input } from '~/components/UI/Input';

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { refetch } = useQuery(ME_QUERY);

  const router = useRouter();
  const form = useForm<Inputs>();
  const [resError, setResError] = useState();

  async function onSubmit(data: SubmitHandler<Inputs>) {
    const res = await fetch(`${window.location.origin}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status >= 400) {
      setResError(await res.json());
    }

    if (res.status == 200) {
      // Refetch the me query so the cache gets update with the newly logged in user
      await refetch();

      router.push('/');
    }
  }

  return (
    <Container>
      <Form form={form} onSubmit={onSubmit}>
        {resError && <pre>{JSON.stringify(resError, null, 2)}</pre>}

        <Input label="Email" type="email" {...form.register('email', {})} />

        <Input label="Password" type="password" {...form.register('password', {})} />

        <input type="submit" />
      </Form>

      <CustomLink href="/auth/signup">No Account? No Problem! Signup</CustomLink>
    </Container>
  );
}
