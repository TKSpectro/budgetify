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
import { Link } from '~/components/UI/Link';
import { MeQuery, MeQueryVariables } from '~/components/__generated__/Header.generated';
import { LoginMutation, LoginMutationVariables } from './__generated__/login.page.generated';

const LOGIN_MUTATION = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Login() {
  const { t } = useTranslation(['common', 'auth']);

  const { refetch } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);
  const router = useRouter();

  const [loginMutation, { error }] = useMutation<LoginMutation, LoginMutationVariables>(
    LOGIN_MUTATION,
    {
      onError: () => {},
      onCompleted: () => {
        // Refetch the user for the cache to get updated and then redirect to the homepage
        refetch();
        router.push('/');
      },
    },
  );

  const loginForm = useForm<LoginMutationVariables>();

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
      <Container title={t('login')}>
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
            label={t('password')}
            type="password"
            autoComplete="current-password"
            {...loginForm.register('password', {
              required: { value: true, message: t('passwordMessage') },
            })}
          />

          <Button type="submit">{t('login')}</Button>
        </Form>

        <Link href="/auth/signup">{t('auth:noAccountText')}</Link>
        <div>
          <Link href="/auth/forgotPassword">{t('auth:forgotPasswordText')}</Link>
        </div>
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
