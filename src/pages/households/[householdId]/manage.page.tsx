import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import InviteManager from '~/components/Household/Manage/InviteManager';
import MemberTable from '~/components/Household/Manage/MemberTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Invite, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import {
  HouseholdManageQuery,
  HouseholdManageQueryVariables,
} from './__generated__/manage.page.generated';

const HOUSEHOLD_QUERY = gql`
  query householdManageQuery($householdId: String!) {
    me {
      id
    }
    household(id: $householdId) {
      id
      name
      owner {
        id
        firstname
        lastname
      }
      members {
        id
        name
        email
      }
      invites {
        id
        validUntil
        wasUsed
        invitedEmail
        token
        createdAt
        updatedAt
        sender {
          id
          name
        }
      }
    }
  }
`;

export default function ManageHousehold() {
  const { t } = useTranslation(['householdsIdManage', 'common']);

  const router = useRouter();
  const householdId = router.query.householdId as string;
  const { data, loading, error, refetch } = useQuery<
    HouseholdManageQuery,
    HouseholdManageQueryVariables
  >(HOUSEHOLD_QUERY, {
    variables: {
      householdId: householdId,
    },
  });

  const currentUserId = data?.me?.id || '';

  const household = data?.household;
  const owner = household?.owner;
  const members = household?.members;
  const invites = household?.invites;

  return (
    <>
      <Head>
        <title>{t('common:manage') + ' ' + household?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container>
        <Error title={t('common:loadingError')} error={error} />
        <Error
          title={t('householdNotFoundError')}
          error={!loading && !household ? '' : undefined}
        />
        <Loader loading={loading} />

        {!loading && !error && members && (
          <MemberTable
            members={members as User[]}
            owner={owner as User}
            currentUserId={currentUserId}
            refetch={refetch}
            t={t}
          />
        )}
      </Container>
      <Container>
        <Error title={t('invitesError')} error={error} />
        <Error title={t('invitesNotFoundError')} error={!loading && !invites ? '' : undefined} />
        <Loader loading={loading} />

        {!loading && !error && invites && (
          <InviteManager
            invites={invites as Invite[]}
            owner={owner as User}
            currentUserId={currentUserId}
            refetch={refetch}
            t={t}
          />
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, {
    //CHECK_HOUSEHOLD_OWNER: ctx.query.householdId as string,
  });

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['householdsIdManage', 'common'])),
      ...(await preloadQuery(ctx, {
        query: HOUSEHOLD_QUERY,
        variables: {
          householdId: ctx.params!.householdId,
        },
      })),
    },
  };
};
