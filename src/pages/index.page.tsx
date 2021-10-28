import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { HomeQuery, HomeQueryVariables } from './__generated__/index.page.generated';

export const HOME_QUERY = gql`
  query homeQuery {
    me {
      id
      firstname
      lastname
      name
      email
      receiveNotifications
      isAdmin
      households {
        id
        name
        sumOfAllPayments
        owner {
          name
        }
      }
      groups {
        id
        name
        value
        transactionCount
      }
    }
  }
`;

export default function Home() {
  const { t } = useTranslation(['common', 'home']);

  const { data, loading, error } = useQuery<HomeQuery, HomeQueryVariables>(HOME_QUERY);

  const loggedIn = !!data?.me;

  const households = data?.me?.households || [];
  const groups = data?.me?.groups || [];

  return (
    <div>
      <Head>
        <title>budgetify</title>
      </Head>

      {loggedIn ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 lg:gap-x-8 overflow-auto md:mx-16 md:px-4">
          <Container>
            <Error
              title={t('home:householdsNotFoundError')}
              error={households.length === 0 ? '' : undefined}
            />
            <Error title={t('loadingError')} error={error} />
            <Loader loading={loading} />

            {households.map((household) => {
              return (
                <Link href={`/households/${household?.id}`} passHref key={household?.id}>
                  <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                    <div className="text-xl">
                      {household?.name}
                      <span className="float-right hidden sm:block">
                        Balance: {household?.sumOfAllPayments}€
                      </span>
                    </div>
                    <div>
                      {t('home:owner')}: {household?.owner?.name}
                    </div>
                    <span className="sm:hidden">Balance: {household?.sumOfAllPayments}€</span>
                  </div>
                </Link>
              );
            })}
          </Container>
          <Container>
            <Error
              title={t('home:groupsNotFoundError')}
              error={groups.length === 0 ? '' : undefined}
            />
            <Loader loading={loading} />

            {groups.map((group) => {
              return (
                <Link href={`/groups/${group?.id}`} passHref key={group?.id}>
                  <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                    <div className="text-xl">
                      {group?.name}
                      <span className="float-right hidden sm:block">Balance: {group?.value}€</span>
                    </div>
                    <div>
                      {t('home:transactions')}: {group?.transactionCount}
                    </div>
                    <span className="sm:hidden">Balance: {group?.value}€</span>
                  </div>
                </Link>
              );
            })}
          </Container>
        </div>
      ) : (
        // TODO: Style index page with some marketing information etc.
        // This gets shown if the user is not logged in
        <div className="w-full text-center mt-16">
          <div className="font-bold text-8xl text-brand-500">budgetify</div>
          <div className="font-semibold text-2xl mt-4">Improve your household financials</div>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'home'])),
      ...(await preloadQuery(ctx, { query: HOME_QUERY })),
    },
  };
};
