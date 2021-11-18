import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Switch } from '~/components/UI/Switch';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  LogoutMutation,
  LogoutMutationVariables,
  ProfileMeQuery,
  ProfileMeQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from './__generated__/profile.page.generated';

export const PROFILE_ME_QUERY = gql`
  query profileMeQuery {
    me {
      id
      firstname
      lastname
      name
      email
      receiveNotifications
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation updateUserMutation(
    $firstname: String
    $lastname: String
    $email: String
    $receiveNotifications: Boolean
  ) {
    updateUser(
      firstname: $firstname
      lastname: $lastname
      email: $email
      receiveNotifications: $receiveNotifications
    ) {
      id
      name
      email
      receiveNotifications
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation deleteUserMutation {
    deleteUser {
      id
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation logoutMutation {
    logout
  }
`;

export default function Profile() {
  const { t } = useTranslation(['common', 'profile']);

  const router = useRouter();
  const client = useApolloClient();

  const updateUserForm = useForm<UpdateUserMutationVariables>();
  const { reset } = updateUserForm;

  const { data, loading, error, refetch } = useQuery<ProfileMeQuery, ProfileMeQueryVariables>(
    PROFILE_ME_QUERY,
    {
      onError: (err) => {},
    },
  );
  const me = data?.me;

  const [updateUser, { error: updateUserError }] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [deleteUser, { error: deleteUserError }] = useMutation<
    DeleteUserMutation,
    DeleteUserMutationVariables
  >(DELETE_USER_MUTATION, {
    onCompleted: () => {
      logoutHandler();
    },
    onError: () => {},
  });

  const [logoutMutation, { error: logoutError }] = useMutation<
    LogoutMutation,
    LogoutMutationVariables
  >(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Clear apollo client cache -> remove user data from cache
      client.resetStore();

      router.push('/auth/login');
    },
    onError: () => {},
  });

  function logoutHandler() {
    logoutMutation();
  }

  const updateUserClickHandler = () => {
    reset({ ...me });
  };

  const updateUserHandler = () => {
    updateUser({
      variables: { ...updateUserForm.getValues() },
    });
  };

  return (
    <>
      <Head>
        <title>{t('profile:pageTitle')} | budgetify</title>
      </Head>
      <Container title={t('profile:pageTitle')}>
        <Error title={t('loadingError')} error={error} />
        <Error title={t('profile:deleteAccountError')} error={deleteUserError} />
        <Error title={t('profile:logoutError')} error={logoutError} />
        <Error title={t('profile:updateAccountError')} error={updateUserError} />
        <Loader loading={loading} />

        {!loading && !error && data && (
          <>
            <div className="mb-4">
              <div className="text-lg font-medium">{t('name')}</div>
              <div className="overflow-auto ml-2">{me?.name}</div>
              <div className="text-lg font-medium">{t('email')}</div>
              <div className="overflow-auto ml-2">{me?.email}</div>
              <div className="text-lg font-medium">{t('profile:receiveNotifications')}</div>
              <div className="overflow-auto ml-2">
                <span className="flex items-center">
                  {me?.receiveNotifications ? (
                    <>
                      {t('enabled')}
                      <CheckIcon className="w-5 h-5 ml-1 border-2 border-brand-500 rounded-lg text-brand-500" />
                    </>
                  ) : (
                    <>
                      {t('disabled')}
                      <XIcon className="w-5 h-5 ml-1 border-2 border-red-500 rounded-lg text-red-500" />
                    </>
                  )}
                </span>
              </div>
            </div>

            <div>
              <Button onClick={logoutHandler} className="mr-4 mt-2 w-full sm:w-auto">
                {t('logout')}
              </Button>

              <div className="flex sm:block">
                <Button
                  className="mt-2 mr-4 flex-grow sm:w-auto"
                  onClick={() => router.push('/auth/changePassword')}
                >
                  {t('profile:changePassword')}
                </Button>

                <ModalForm
                  form={updateUserForm}
                  buttonText={t('profile:updateAccount')}
                  title={t('profile:updateAccount')}
                  onSubmit={updateUserHandler}
                  buttonClassName="mt-2 sm:mr-4 flex-grow sm:w-auto"
                  onClick={updateUserClickHandler}
                >
                  <Input
                    label={t('firstname')}
                    autoComplete="given-name"
                    {...updateUserForm.register('firstname', {
                      required: { value: true, message: t('firstnameMessage') },
                      maxLength: { value: 60, message: t('firstnameLengthMessage') },
                    })}
                  ></Input>
                  <Input
                    label={t('lastname')}
                    autoComplete="family-name"
                    {...updateUserForm.register('lastname', {
                      required: { value: true, message: t('lastnameMessage') },
                      maxLength: { value: 60, message: t('lastnameLengthMessage') },
                    })}
                  ></Input>
                  <Input
                    label={t('email')}
                    type="email"
                    autoComplete="email"
                    {...updateUserForm.register('email', {
                      required: { value: true, message: t('emailMessage') },
                    })}
                  ></Input>

                  <div className="py-1 px-2 text-md font-semibold flex mt-2">
                    {t('profile:receiveNotifications')}
                    <div className="ml-2 self-center">
                      <Switch
                        isLeft={!!updateUserForm.watch('receiveNotifications')}
                        onClick={() =>
                          updateUserForm.setValue(
                            'receiveNotifications',
                            !updateUserForm.getValues('receiveNotifications'),
                          )
                        }
                        leftIcon={<XIcon className="w-4 h-4" />}
                        rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
                      />
                    </div>
                  </div>
                </ModalForm>
              </div>

              <Modal
                title={t('profile:deleteAccount')}
                description={t('profile:deleteAccountDescription')}
                submitText="Submit"
                onSubmit={deleteUser}
                buttonText={t('profile:deleteAccount')}
                variant="danger"
                buttonClassName="mr-4 mt-8 w-full sm:w-auto"
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'profile'])),
      ...(await preloadQuery(ctx, { query: PROFILE_ME_QUERY })),
    },
  };
};
