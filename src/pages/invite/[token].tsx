import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const QUERY = gql`
  query GET_TOKEN($token: String!) {
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
  mutation USE_TOKEN_MUTATION($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

export default function UseInvite() {
  const router = useRouter();
  const { token } = router.query;

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(QUERY, { variables: { token: token } });

  const invite = queryData?.getInviteByToken;

  const [useTokenMutation, { error: useTokenError }] = useMutation(USE_TOKEN_MUTATION, {
    onCompleted: () => {
      if (invite.groupId) {
        router.push(`/groups/${invite.groupId}`);
      }
      if (invite.householdId) {
        router.push(`/households/${invite.householdId}`);
      }
    },
    onError: () => {},
  });

  const useTokenHandler = () => useTokenMutation({ variables: { token: token } });

  return (
    <Container>
      <Error title="Could not find invite." error={queryError} />
      <Error title="Could not use token." error={useTokenError} />
      <Loader loading={queryLoading} />

      {invite && (
        <div className="text-center">
          <div>{invite.token}</div>
          <div className="mx-auto mt-2 block">
            <Button onClick={useTokenHandler}>Use Token</Button>
          </div>
        </div>
      )}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: QUERY,
    variables: { token: ctx.params!.token },
  });
};
