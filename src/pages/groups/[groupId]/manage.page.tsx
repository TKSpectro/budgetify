import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { useRouter } from 'next/router';
import { DeleteGroupModal } from '~/components/Group/Manage/DeleteGroupModal';
import { InviteTable } from '~/components/Group/Manage/InviteTable';
import { MemberTable } from '~/components/Group/Manage/MemberTable';
import { NewInviteButton } from '~/components/Group/Manage/NewInviteButton';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Invite, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { GroupManageQuery, GroupManageQueryVariables } from './__generated__/manage.page.generated';

const QUERY = gql`
  query groupManageQuery($id: String!) {
    me {
      id
    }
    group(groupId: $id) {
      id
      name
      value
      owners {
        id
        name
      }
      members {
        id
        name
        email
      }
      invites {
        id
        invitedEmail
        validUntil
      }
    }
  }
`;

export default function ManageGroup() {
  const { t } = useTranslation(['groupsIdManage', 'common']);

  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error, refetch } = useQuery<GroupManageQuery, GroupManageQueryVariables>(
    QUERY,
    {
      variables: { id: groupId },
    },
  );

  const currentUserId = data?.me?.id || '';
  const group = data?.group;

  const members = group?.members || [];
  const owners = group?.owners || [];
  const invites = group?.invites || [];

  const isOwner = !!owners.find((x) => x?.id === currentUserId);

  return (
    <>
      <Head>
        <title>{t('manageGroupName', { groupName: group?.name })} | budgetify</title>
      </Head>
      <Container title={t('manageGroupName', { groupName: group?.name })}>
        <Error title={t('common:loadingError')} error={error} />

        <MemberTable
          members={members as User[]}
          owners={owners as User[]}
          currentUserId={currentUserId as string}
          refetch={refetch}
          t={t}
        />

        <Loader loading={loading} />

        {/* // If the user is an owner of the group show a delete modal for the group */}
        {isOwner && <DeleteGroupModal groupId={groupId} t={t} />}
      </Container>

      <Container
        title={t('manageInvites')}
        action={isOwner ? <NewInviteButton groupId={groupId} t={t} refetch={refetch} /> : null}
      >
        <Loader loading={loading} />

        <Error
          title={t('noPendingInvites')}
          error={!loading && invites.length === 0 ? '' : undefined}
          className="mt-4"
        />

        <InviteTable invites={invites as Invite[]} isOwner={isOwner} refetch={refetch} t={t} />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['groupsIdManage', 'common'])),
      ...(await preloadQuery(ctx, { query: QUERY, variables: { id: ctx.params!.groupId } })),
    },
  };
};
