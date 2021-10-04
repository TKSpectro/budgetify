import { gql, useMutation } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import {
  ChangePasswordMutation,
  ChangePasswordMutationVariables,
} from './__generated__/changePassword.page.generated';

const CHANGE_PASSWORD = gql`
  mutation changePasswordMutation($password: String!, $passwordRepeat: String!) {
    changePassword(password: $password, passwordRepeat: $passwordRepeat) {
      id
    }
  }
`;

export default function ChangePassword() {
  const { t } = useTranslation(['common', 'auth']);

  const router = useRouter();

  const [changePassword, { error }] = useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(CHANGE_PASSWORD, {
    onError: () => {},
    onCompleted: () => {
      router.push('/profile');
    },
  });

  const changePasswordForm = useForm<ChangePasswordMutationVariables>();

  function onSubmit() {
    changePassword({
      variables: {
        ...changePasswordForm.getValues(),
      },
    });
  }

  return (
    <Container>
      <Error title={t('auth:changePasswordError')} error={error} />

      {router?.query?.isOTP && (
        <div className="font-semibold text-lg mb-2">{t('auth:changePasswordOTP')}</div>
      )}

      <Form form={changePasswordForm} onSubmit={onSubmit}>
        <Input
          label={t('password')}
          type="password"
          autoComplete="new-password"
          {...changePasswordForm.register('password', {
            required: { value: true, message: t('passwordMessage') },
            minLength: { value: 6, message: t('passwordLengthMessage') },
          })}
        />

        <Input
          label={t('auth:repeatPassword')}
          type="password"
          autoComplete="new-password"
          {...changePasswordForm.register('passwordRepeat', {
            required: { value: true, message: t('passwordMessage') },
            minLength: { value: 6, message: t('passwordLengthMessage') },
            validate: (value) =>
              value === changePasswordForm.getValues('password') ||
              t('auth:repeatPasswordNoMatch') + '',
          })}
        />

        <Button type="submit">{t('auth:changePassword')}</Button>
      </Form>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'auth'])),
    },
  };
};
