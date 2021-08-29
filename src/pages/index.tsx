import { useQuery } from '@apollo/client';
import Head from 'next/head';
import React from 'react';
import { ME_QUERY } from '~/components/UI/Header';
import { Link } from '~/components/UI/Link';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';

export default function Home() {
  const { data, loading, error } = useQuery(ME_QUERY);

  return (
    <div>
      <Head>
        <title>budgetify</title>
      </Head>
      {loading && <LoadingAnimation />}

      <pre>{JSON.stringify(data, null, 2)}</pre>
      {!data && <div>Not logged in!</div>}
      {!data && (
        <div>
          <Link href="/auth/signup">No Account? No Problem! Signup</Link>
        </div>
      )}
      {!data && (
        <div>
          <Link href="/auth/login">Do you already have an account? Login</Link>
        </div>
      )}
      {data && <Link href="/profile">Profile</Link>}
    </div>
  );
}
