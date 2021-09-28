import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { ModalForm } from '~/components/UI/ModalForm';
import { Switch } from '~/components/UI/Switch';
import { MutationUpdateUserArgs, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const UPDATE_USER_QUERY = gql`
  mutation ($firstname: String, $lastname: String, $email: String, $receiveNotifications: Boolean) {
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

const DELETE_USER_QUERY = gql`
  mutation DeleteUser {
    deleteUser {
      id
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const ME_QUERY = gql`
  query ME_QUERY {
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

export default function Profile() {
  const router = useRouter();
  const client = useApolloClient();

  const updateUserForm = useForm<MutationUpdateUserArgs>();
  const { reset } = updateUserForm;

  const { data, loading, error, refetch } = useQuery(ME_QUERY);

  const [updateUser, { error: updateUserError }] = useMutation<MutationUpdateUserArgs>(
    UPDATE_USER_QUERY,
    {
      onCompleted: () => {
        refetch();
      },
      onError: () => {},
    },
  );

  const [deleteUser, { error: deleteUserError }] = useMutation(DELETE_USER_QUERY, {
    onCompleted: () => {
      logoutHandler();
    },
    onError: () => {},
  });

  const [logoutMutation, { error: logoutError }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Clear apollo client cache -> remove user data from cache
      client.resetStore();

      router.push('/auth/login');
    },
    onError: () => {},
  });

  // Need to reset the updateUser form data with the data from the ME_QUERY
  const me: User = data?.me;
  useEffect(() => {
    const data: MutationUpdateUserArgs = {
      ...me,
    };
    // Set state for switch as its not getting handled automatically
    reset(data);
  }, [me, reset]);

  function logoutHandler() {
    logoutMutation();
  }

  const updateUserHandler = () => {
    updateUser({
      variables: { ...updateUserForm.getValues() },
    });
  };

  return (
    <>
      <Head>
        <title>Profile | budgetify</title>
      </Head>
      <Container>
        <Error title="Failed to load user data!" error={error} />
        <Error title="Failed to delete user!" error={deleteUserError} />
        <Error title="Failed to logout!" error={logoutError} />
        <Error title="Failed to update user!" error={updateUserError} />
        <Loader loading={loading} />

        {!loading && !error && data && (
          <>
            <div className="mb-4">
              <div className="font-semibold text-xl">Profile</div>
              <div className="text-lg font-medium">Name</div>
              <div className="overflow-auto ml-2">{me?.name}</div>
              <div className="text-lg font-medium">Email</div>
              <div className="overflow-auto ml-2">{me?.email}</div>
              <div className="text-lg font-medium">Receive Notifications</div>
              <div className="overflow-auto ml-2">
                {me?.receiveNotifications ? (
                  <span className="flex">
                    Enabled
                    <CheckIcon className="w-6 h-6 ml-1 border-2 border-brand-500 rounded-lg text-brand-500" />
                  </span>
                ) : (
                  <span className="flex">
                    Disabled
                    <XIcon className="w-6 h-6 ml-1 border-2 border-red-500 rounded-lg text-red-500" />
                  </span>
                )}
              </div>
            </div>

            <div className="">
              <Modal
                title="Delete Account"
                description="If you delete your account all your data will be lost. All households you own will be transferred to another person."
                submitText="Submit"
                onSubmit={deleteUser}
                buttonText="DELETE ACCOUNT"
                variant="danger"
                buttonClassName="mr-4"
              />
              <Button className="mr-4" onClick={() => router.push('/auth/changePassword')}>
                Change password
              </Button>
              <ModalForm
                form={updateUserForm}
                buttonText="Update account"
                title="Update account data"
                onSubmit={updateUserHandler}
                submitText="Update account"
                buttonClassName="mr-4"
              >
                <Input
                  label="Firstname"
                  autoComplete="given-name"
                  {...updateUserForm.register('firstname', {
                    required: { value: true, message: 'Please input your firstname' },
                  })}
                ></Input>
                <Input
                  label="Lastname"
                  autoComplete="family-name"
                  {...updateUserForm.register('lastname', {
                    required: { value: true, message: 'Please input your lastname' },
                  })}
                ></Input>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  {...updateUserForm.register('email', {
                    required: { value: true, message: 'Please input your email' },
                  })}
                ></Input>

                <label>
                  Receive Notifications?
                  <Switch
                    isLeft={!!updateUserForm.watch('receiveNotifications')}
                    // onClick={() => setIsReceivingNotification(!isReceivingNotification)}
                    onClick={() =>
                      updateUserForm.setValue(
                        'receiveNotifications',
                        !updateUserForm.getValues('receiveNotifications'),
                      )
                    }
                    leftIcon={<XIcon className="w-4 h-4 " />}
                    rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
                  />
                </label>
              </ModalForm>
              <Button onClick={logoutHandler}>Logout</Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, { query: ME_QUERY });
};
