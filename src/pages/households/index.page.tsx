import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { HouseholdContainer } from '~/components/Index/HouseholdContainer';
import { Household } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import {
  HouseholdListQuery,
  HouseholdListQueryVariables,
} from './__generated__/index.page.generated';

const HOUSEHOLD_LIST_QUERY = gql`
  query householdListQuery {
    households {
      id
      name
      sumOfAllPayments
      owner {
        firstname
        lastname
        name
      }
    }
  }
`;

const USE_INVITE_TOKEN_MUTATION = gql`
  mutation useInviteTokenMutation($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

const CREATE_HOUSEHOLD_MUTATION = gql`
  mutation createHouseholdMutation($name: String!) {
    createHousehold(name: $name) {
      id
    }
  }
`;

export default function Households() {
  const { t } = useTranslation(['common', 'households']);

  const { data, loading, error, refetch } = useQuery<
    HouseholdListQuery,
    HouseholdListQueryVariables
  >(HOUSEHOLD_LIST_QUERY);

  const households = data?.households || [];

  return (
    <>
      <Head>
        <title>{t('common:households')} | budgetify</title>
      </Head>

      <HouseholdContainer
        households={households as Household[]}
        loading={loading}
        error={error}
        refetch={refetch}
        t={t}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['households', 'common'])),
      ...(await preloadQuery(ctx, { query: HOUSEHOLD_LIST_QUERY })),
    },
  };
};
