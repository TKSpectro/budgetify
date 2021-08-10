import { useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { MeQuery } from '~/components/UI/Header';
import { preloadQuery } from '~/utils/apollo';
import { CustomLink } from '~/components/UI/CustomLink';
import { Button } from '~/components/UI/Button';

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
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {!data && <div>Not logged in!</div>}
      {!data && (
        <div>
          <CustomLink href="/auth/signup">No Account? No Problem! Signup</CustomLink>
        </div>
      )}
      {!data && (
        <div>
          <CustomLink href="/auth/login">Do you already have an account? Login</CustomLink>
        </div>
      )}
      {data && <Button onClick={logoutHandler}>Logout</Button>}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, { query: MeQuery });
