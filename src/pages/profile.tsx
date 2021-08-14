import { useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { MeQuery } from '~/components/UI/Header';
import Modal from '~/components/UI/Modal';
import { preloadQuery } from '~/utils/apollo';

export default function Profile() {
  const { data, loading, error } = useQuery(MeQuery);
  const router = useRouter();

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
    <Container>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="flex">
        <Modal
          title="Delete Account"
          description="If you delete your account all your data will be lost. All households you own will be transferred to another person."
          submitText="Submit"
          onSubmit={() => {
            // TODO: Delete Account
            console.log('ModalSubmitted');
          }}
          buttonText="DELETE ACCOUNT"
          color="red"
        />
        {data && <Button onClick={logoutHandler}>Logout</Button>}
      </div>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, { query: MeQuery });
