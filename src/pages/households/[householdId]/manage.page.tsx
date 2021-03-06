import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { InviteList } from '~/components/Household/Manage/InviteList';
import { MemberTable } from '~/components/Household/Manage/MemberTable';
import { NewInviteModal } from '~/components/Household/Manage/NewInviteModal';
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
  const members = household?.members || [];
  const invites = household?.invites || [];

  const isOwner = currentUserId === owner?.id;

  return (
    <>
      <Head>
        <title>{t('common:manage') + ' ' + household?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container title={t('manageHouseholdName', { householdName: household?.name })}>
        <Error title={t('common:loadingError')} error={error} />
        <Error
          title={t('householdNotFoundError')}
          error={!loading && !household ? '' : undefined}
        />

        <MemberTable
          members={members as User[]}
          owner={owner as User}
          currentUserId={currentUserId}
          refetch={refetch}
          t={t}
        />

        <Loader loading={loading} />
      </Container>

      <Container
        title={t('manageInvites')}
        action={isOwner ? <NewInviteModal t={t} refetch={refetch} /> : null}
      >
        <Loader loading={loading} />
        <Error
          title={t('noPendingInvites')}
          error={!loading && invites.length === 0 ? '' : undefined}
          className="mt-4"
        />

        <InviteList
          invites={invites as Invite[]}
          isOwner={isOwner}
          currentUserId={currentUserId}
          refetch={refetch}
          t={t}
        />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

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
