import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ME_QUERY } from '~/components/Header';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { MeQuery, MeQueryVariables } from '~/components/__generated__/Header.generated';
import {
  OtpLoginMutation,
  OtpLoginMutationVariables,
} from './__generated__/otpLogin.page.generated';

const LOGIN_MUTATION = gql`
  mutation otpLoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password, isOTP: true) {
      token
    }
  }
`;

export default function OTPLogin() {
  const { t } = useTranslation(['common', 'auth']);

  const { refetch } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);
  const router = useRouter();

  const [loginMutation, { error }] = useMutation<OtpLoginMutation, OtpLoginMutationVariables>(
    LOGIN_MUTATION,
    {
      onError: () => {},
      onCompleted: () => {
        refetch();
        router.push('/auth/changePassword?isOTP=true');
      },
    },
  );

  const loginForm = useForm<OtpLoginMutationVariables>();

  function onSubmit() {
    loginMutation({
      variables: {
        ...loginForm.getValues(),
      },
    });
  }

  return (
    <>
      <Head>
        <title>{t('login')} | budgetify</title>
      </Head>
      <Container title={t('login')} small>
        <div className="mb-2">
          <Error title={t('auth:loginError')} error={error} />
        </div>

        <Form form={loginForm} onSubmit={onSubmit}>
          <Input
            label={t('email')}
            type="email"
            autoComplete="email"
            {...loginForm.register('email', {
              required: { value: true, message: t('emailMessage') },
            })}
          />

          <Input
            label={t('auth:otp')}
            type="password"
            autoComplete="one-time-code"
            {...loginForm.register('password', {
              required: { value: true, message: t('auth:otpMessage') },
            })}
          />

          <Button type="submit">{t('login')}</Button>
        </Form>
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
