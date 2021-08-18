import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { CustomLink } from '~/components/UI/CustomLink';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export default function Signup() {
  // return (
  //   <div>
  //     <SignupForm />
  //     <CustomLink href="/auth/login">Do you already have an account? Login</CustomLink>
  //   </div>
  // );

  const router = useRouter();
  const form = useForm<Inputs>();
  const [resError, setResError] = useState();

  async function onSubmit(data: SubmitHandler<Inputs>) {
    const res = await fetch(`${window.location.origin}/api/auth/signup`, {
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
      router.push('/');
    }
  }

  return (
    <Container>
      <Form form={form} onSubmit={onSubmit}>
        {resError && <pre>{JSON.stringify(resError, null, 2)}</pre>}

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

        <input type="submit" />
      </Form>

      <CustomLink href="/auth/login">Do you already have an account? Login</CustomLink>
    </Container>
  );
}
