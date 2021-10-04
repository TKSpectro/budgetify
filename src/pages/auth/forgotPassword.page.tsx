import { gql, useMutation } from '@apollo/client';
import { CheckIcon } from '@heroicons/react/outline';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import {
  RequestOtpMutation,
  RequestOtpMutationVariables,
} from './__generated__/forgotPassword.page.generated';

const REQUEST_OTP = gql`
  mutation requestOTPMutation($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export default function ForgotPassword() {
  const [requestOTP, { data, error }] = useMutation<
    RequestOtpMutation,
    RequestOtpMutationVariables
  >(REQUEST_OTP, {
    onError: () => {},
    onCompleted: () => {},
  });

  const requestOTPForm = useForm<RequestOtpMutationVariables>();

  function onSubmit() {
    requestOTP({
      variables: {
        ...requestOTPForm.getValues(),
      },
    });
  }

  return (
    <Container>
      <Error title="Failed to request one-time-password." error={error} />

      <div className="font-semibold text-lg mb-2">Recover Password</div>
      <div className="font-medium text-md mb-2">Don&apos;t worry, happens to the best of us.</div>

      {!data ? (
        <Form form={requestOTPForm} onSubmit={onSubmit}>
          <Input
            label="Your email"
            type="text"
            autoComplete="email"
            {...requestOTPForm.register('email', {
              required: { value: true, message: 'Email is required.' },
            })}
          />

          <Button type="submit">Email me a recovery link</Button>
        </Form>
      ) : (
        <>
          <CheckIcon className="w-2/5 sm:w-1/5 sm:h-1/5 mx-auto mt-4 text-brand-500 border-4 border-brand-500 rounded-full" />
          <div className="text-center text-lg font-medium mt-2">{data.requestPasswordReset}</div>
        </>
      )}
    </Container>
  );
}
