import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
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
import { SignupMutation, SignupMutationVariables } from './__generated__/signup.page.generated';

const SIGNUP_MUTATION = gql`
  mutation signupMutation(
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
  const { t } = useTranslation(['common', 'auth']);

  const { refetch } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);
  const router = useRouter();

  const [signupMutation, { error }] = useMutation<SignupMutation, SignupMutationVariables>(
    SIGNUP_MUTATION,
    {
      onError: () => {},
      onCompleted: () => {
        // Refetch the user for the cache to get updated and then redirect to the homepage
        refetch();
        router.push('/');
      },
    },
  );

  const signupForm = useForm<SignupMutationVariables>();

  function onSubmit() {
    signupMutation({
      variables: { ...signupForm.getValues() },
    });
  }

  return (
    <>
      <Head>
        <title>{t('signup')} | budgetify</title>
      </Head>
      <Container title={t('signup')}>
        <div className="mb-2">
          <Error title={t('auth:signupError')} error={error} />
        </div>

        <Form form={signupForm} onSubmit={onSubmit}>
          <Input
            label={t('firstname')}
            type="text"
            autoComplete="given-name"
            {...signupForm.register('firstname', {
              required: { value: true, message: t('firstnameMessage') },
              maxLength: { value: 60, message: t('firstnameLengthMessage') },
            })}
          />

          <Input
            label={t('lastname')}
            type="text"
            autoComplete="family-name"
            {...signupForm.register('lastname', {
              required: { value: true, message: t('lastnameMessage') },
              maxLength: { value: 60, message: t('lastnameLengthMessage') },
            })}
          />

          <Input
            label={t('email')}
            type="email"
            autoComplete="email"
            {...signupForm.register('email', {
              required: { value: true, message: t('emailMessage') },
            })}
          />

          <Input
            label={t('password')}
            type="password"
            autoComplete="new-password"
            {...signupForm.register('password', {
              required: { value: true, message: t('passwordMessage') },
              minLength: { value: 6, message: t('passwordLengthMessage') },
            })}
          />

          <Button type="submit">{t('signup')}</Button>
        </Form>

        <Link href="/auth/login">{t('auth:alreadyHaveAccountText')}</Link>
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
