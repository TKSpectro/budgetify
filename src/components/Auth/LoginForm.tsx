import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Form from '../UI/Form';
import { Input } from '../UI/Input';

type Inputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
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
      router.push('/');
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      {resError && <pre>{JSON.stringify(resError, null, 2)}</pre>}

      <Input label="Email" type="email" {...form.register('email', { required: true })} />

      <Input
        label="Password"
        type="password"
        {...form.register('password', { required: true, minLength: 6 })}
      />

      <input type="submit" />
    </Form>
  );
}
