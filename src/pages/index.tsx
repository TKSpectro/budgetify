import { useQuery } from '@apollo/client';
import Head from 'next/head';
import React from 'react';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { ME_QUERY } from '~/components/UI/Header';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';

export default function Home() {
  const { data, loading, error } = useQuery(ME_QUERY);

  return (
    <div>
      <Head>
        <title>budgetify</title>
      </Head>
      <Container>
        <Error title="Could not load user." error={error} />
        <Loader loading={loading} />

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
      </Container>
    </div>
  );
}
