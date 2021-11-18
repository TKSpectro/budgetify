import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GroupContainer } from '~/components/Index/GroupContainer';
import { HouseholdContainer } from '~/components/Index/HouseholdContainer';
import { Informations } from '~/components/Index/Informations';
import { Group, Household } from '~/graphql/__generated__/types';
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
  const { t } = useTranslation(['common', 'home', 'households', 'groups']);

  const { data, loading, error, refetch } = useQuery<HomeQuery, HomeQueryVariables>(HOME_QUERY);

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
          <HouseholdContainer
            households={households as Household[]}
            loading={loading}
            error={error}
            refetch={refetch}
            t={t}
          />
          <GroupContainer
            groups={groups as Group[]}
            loading={loading}
            error={error}
            refetch={refetch}
            t={t}
          />
        </div>
      ) : (
        <Informations />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', [
        'common',
        'home',
        'households',
        'groups',
      ])),
      ...(await preloadQuery(ctx, { query: HOME_QUERY })),
    },
  };
};
