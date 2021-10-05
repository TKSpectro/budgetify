import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { useRouter } from 'next/router';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import {
  GetTokenQuery,
  GetTokenQueryVariables,
  UseTokenMutation,
  UseTokenMutationVariables,
} from './__generated__/[token].page.generated';

const QUERY = gql`
  query getTokenQuery($token: String!) {
    getInviteByToken(token: $token) {
      id
      invitedEmail
      token
      groupId
      householdId
    }
  }
`;

const USE_TOKEN_MUTATION = gql`
  mutation useTokenMutation($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

export default function UseInvite() {
  const { t } = useTranslation(['common', 'invite']);

  const router = useRouter();
  const token = router.query.token as string;

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetTokenQuery, GetTokenQueryVariables>(QUERY, { variables: { token: token } });

  const invite = queryData?.getInviteByToken;

  const [useTokenMutation, { error: useTokenError }] = useMutation<
    UseTokenMutation,
    UseTokenMutationVariables
  >(USE_TOKEN_MUTATION, {
    onCompleted: () => {
      // Depending on what invite was used, redirect to the corresponding page
      if (invite?.groupId) {
        router.push(`/groups/${invite.groupId}`);
      }
      if (invite?.householdId) {
        router.push(`/households/${invite.householdId}`);
      }
    },
    onError: () => {},
  });

  const useTokenHandler = () => useTokenMutation({ variables: { token: token } });

  return (
    <>
      <Head>
        <title>{t('invite:useToken')} | budgetify</title>
      </Head>
      <Container>
        <Error title={t('invite:inviteError')} error={queryError} />
        <Error title={t('invite:useInviteError')} error={useTokenError} />
        <Loader loading={queryLoading} />

        {invite && (
          <div className="text-center">
            <div>{invite.token}</div>
            <div className="mx-auto mt-2 block">
              <Button onClick={useTokenHandler}>{t('invite:useToken')}</Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'invite'])),
      ...(await preloadQuery(ctx, { query: QUERY, variables: { token: ctx.params!.token } })),
    },
  };
};
