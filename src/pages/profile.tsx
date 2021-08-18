import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ThemeSwitch } from '~/components/ThemeSwitch';
import { Alert } from '~/components/UI/Alert';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { MeQuery } from '~/components/UI/Header';
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

export default function Profile() {
  const { data, loading, error } = useQuery(MeQuery);
  const router = useRouter();

  const [deleteUser, { error: deleteUserError }] = useMutation(DELETE_USER_QUERY, {
    onCompleted: () => {
      logoutHandler();
    },
    onError: (error) => {
      // Do nothing so the page does not throw an error and we just show the
      // error to the user, as the component gets render automatically
    },
  });

  async function logoutHandler() {
    await fetch(`${window.location.origin}/api/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // No need to check for response errors as logout cant fail
    // If the authCookie cant get deleted the user is logged-out anyways

    router.push('/auth/login');
  }

  if (loading) return <span>loading...</span>;
  return (
    <>
      <Head>
        <title>Profile | budgetify</title>
      </Head>
      <Container>
        {/* // TODO: Build a error message popover */}
        {deleteUserError && <Alert type="error" message={deleteUserError.message} />}
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <div>
          <ThemeSwitch />
        </div>
        <div className="flex">
          <Modal
            title="Delete Account"
            description="If you delete your account all your data will be lost. All households you own will be transferred to another person."
            submitText="Submit"
            onSubmit={deleteUser}
            buttonText="DELETE ACCOUNT"
            color="red"
          />
          {data && <Button onClick={logoutHandler}>Logout</Button>}
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, { query: MeQuery });
};
