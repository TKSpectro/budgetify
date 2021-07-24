import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '../UI/Input';

type Inputs = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

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
      //setResError(await res.json());
    }

    // TODO: Redirect to user dashboard if it worked
  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Firstname"
        type="text"
        {...register('firstname', { required: true, maxLength: 60 })}
      />

      <Input
        label="Lastname"
        type="text"
        {...register('lastname', { required: true, maxLength: 60 })}
      />

      <Input label="Email" type="email" {...register('email', { required: true })} />

      <Input
        label="Password"
        type="password"
        {...register('password', { required: true, minLength: 6 })}
      />

      <input type="submit" />
    </form>
  );
}
