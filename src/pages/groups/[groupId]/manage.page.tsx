import { gql, useMutation, useQuery } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { useRouter } from 'next/router';
import { InviteManager } from '~/components/Group/Manage/InviteManager';
import MemberTable from '~/components/Group/Manage/MemberTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Modal } from '~/components/UI/Modal';
import { Invite, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { urlOneUp } from '~/utils/helper';
import {
  DeleteGroupMutation,
  DeleteGroupMutationVariables,
  GroupManageQuery,
  GroupManageQueryVariables,
} from './__generated__/manage.page.generated';

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

const DELETE_GROUP_MUTATION = gql`
  mutation deleteGroupMutation($id: String!) {
    deleteGroup(groupId: $id) {
      id
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

  const [deleteGroup, { error: deleteGroupError }] = useMutation<
    DeleteGroupMutation,
    DeleteGroupMutationVariables
  >(DELETE_GROUP_MUTATION, {
    onCompleted: () => {
      router.push(urlOneUp(urlOneUp(router.asPath)));
    },
    onError: () => {},
  });

  const currentUserId = data?.me?.id || '';
  const group = data?.group;

  const members = group?.members || [];
  const owners = group?.owners || [];
  const invites = group?.invites || [];

  const isOwner = !!owners.find((x) => x?.id === currentUserId);

  const deleteGroupHandler = () => {
    deleteGroup({ variables: { id: groupId } });
  };

  return (
    <>
      <Head>
        <title>{t('common:groups') + ' ' + t('common:manage')} | budgetify</title>
      </Head>
      <Container big>
        <Error title={t('common:loadingError')} error={error} />
        <Error title={t('deleteGroupError')} error={deleteGroupError} />

        <MemberTable
          members={members as User[]}
          owners={owners as User[]}
          currentUserId={currentUserId as string}
          refetch={refetch}
          t={t}
        />

        <Loader loading={loading} />

        {isOwner && (
          <Modal
            buttonText={t('deleteGroup')}
            buttonClassName="bg-red-500 mt-4"
            description={t('deleteGroupDescription')}
            onSubmit={deleteGroupHandler}
            title={t('deleteGroup')}
            submitText={<TrashIcon className="w-6 h-6" />}
          />
        )}
      </Container>

      <Container>
        <Loader loading={loading} />

        <InviteManager invites={invites as Invite[]} isOwner={isOwner} refetch={refetch} t={t} />

        <Error
          title={t('noPendingInvites')}
          error={!loading && invites.length === 0 ? '' : undefined}
          className="mt-4"
        />
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
