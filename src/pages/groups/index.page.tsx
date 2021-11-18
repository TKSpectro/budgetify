import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { GroupContainer } from '~/components/Index/GroupContainer';
import { Group } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { GroupsQuery, GroupsQueryVariables } from './__generated__/index.page.generated';

const GROUPS_QUERY = gql`
  query groupsQuery {
    me {
      id
      groups {
        id
        name
        value
        owners {
          id
        }
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

const CREATE_GROUP_MUTATION = gql`
  mutation createGroupMutation($name: String!) {
    createGroup(name: $name) {
      id
      name
      value
      members {
        id
        name
      }
    }
  }
`;

export default function Groups() {
  const { t } = useTranslation(['common', 'groups']);

  const { data, loading, error, refetch } = useQuery<GroupsQuery, GroupsQueryVariables>(
    GROUPS_QUERY,
  );

  const groups = data?.me?.groups;

  return (
    <>
      <Head>
        <title>{t('common:groups')} | budgetify</title>
      </Head>

      <GroupContainer
        groups={groups as Group[]}
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
      ...(await serverSideTranslations(ctx.locale || 'en', ['groups', 'common'])),
      ...(await preloadQuery(ctx, { query: GROUPS_QUERY })),
    },
  };
};
