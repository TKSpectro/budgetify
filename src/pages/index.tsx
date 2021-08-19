import { useQuery } from '@apollo/client';
import Head from 'next/head';
import React from 'react';
import { CustomLink } from '~/components/UI/CustomLink';
import { ME_QUERY } from '~/components/UI/Header';

export default function Home() {
  const { data, loading, error } = useQuery(ME_QUERY);

  if (loading) return <span>loading...</span>;

  return (
    <div>
      <Head>
        <title>budgetify</title>
      </Head>
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
      {data && <CustomLink href="/profile">Profile</CustomLink>}
    </div>
  );
}
