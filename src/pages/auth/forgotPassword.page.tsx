import { gql, useMutation } from '@apollo/client';
import { CheckIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
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
  const { t } = useTranslation(['common', 'auth']);

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
    <>
      <Head>
        <title>{t('auth:forgotPassword')} | budgetify</title>
      </Head>
      <Container title={t('auth:recoverPassword')} small>
        <Error title="Failed to request one-time-password." error={error} />

        <div className="font-medium text-md mb-2">{t('auth:recoverPasswordText')}</div>

        {!data ? (
          <Form form={requestOTPForm} onSubmit={onSubmit}>
            <Input
              label={t('email')}
              type="email"
              autoComplete="email"
              {...requestOTPForm.register('email', {
                required: { value: true, message: t('emailMessage') },
              })}
            />

            <Button type="submit">{t('auth:recoverPasswordSubmit')}</Button>
          </Form>
        ) : (
          <>
            <CheckIcon className="w-2/5 sm:w-1/5 sm:h-1/5 mx-auto mt-4 text-brand-500 border-4 border-brand-500 rounded-full" />
            <div className="text-center text-lg font-medium mt-2">
              {t('auth:recoverPasswordSubmitText')}
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'auth'])),
    },
  };
};
