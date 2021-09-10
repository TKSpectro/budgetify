import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { ME_QUERY } from '~/components/UI/Header';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

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

export default function Profile() {
  const { data, loading, error } = useQuery(ME_QUERY);
  const router = useRouter();

  const client = useApolloClient();

  const [deleteUser, { error: deleteUserError }] = useMutation(DELETE_USER_QUERY, {
    onCompleted: () => {
      logoutHandler();
    },
    onError: (error) => {
      // Do nothing so the page does not throw an error and we just show the
      // error to the user, as the component gets render automatically
    },
  });

  const [logoutMutation, { error: logoutError }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      // Clear apollo client cache -> remove user data from cache
      client.resetStore();

      router.push('/auth/login');
    },
    onError: (error) => {
      // Do nothing so the page does not throw an error and we just show the
      // error to the user, as the component gets render automatically
    },
  });

  function logoutHandler() {
    logoutMutation();
  }

  return (
    <>
      <Head>
        <title>Profile | budgetify</title>
      </Head>
      <Container>
        <Error title="Failed to load user data!" error={error} />
        <Error title="Failed to delete user!" error={deleteUserError} />
        <Error title="Failed to logout!" error={logoutError} />
        <Loader loading={loading} />

        {!loading && !error && data && (
          <>
            <pre>{JSON.stringify(data, null, 2)}</pre>

            <div className="flex">
              <Modal
                title="Delete Account"
                description="If you delete your account all your data will be lost. All households you own will be transferred to another person."
                submitText="Submit"
                onSubmit={deleteUser}
                buttonText="DELETE ACCOUNT"
                variant="danger"
                buttonClassName="mr-4"
              />
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
