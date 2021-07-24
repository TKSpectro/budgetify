import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { Button } from '~/components/UI/Button';
import { CustomLink } from '~/components/UI/CustomLink';

const MeQuery = gql`
  query MyQuery {
    me {
      id
      firstname
      lastname
      email
      createdAt
      updatedAt
    }
  }
`;

export default function Home() {
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
