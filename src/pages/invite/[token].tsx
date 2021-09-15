import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { authenticatedRoute } from '~/utils/auth';

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

  const [useTokenMutation, { error: useTokenError }] = useMutation(USE_TOKEN_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const useTokenHandler = () => useTokenMutation({ variables: { token: token } });

  return (
    <Container>
      <Error title="Could not use token." error={useTokenError} />
      <div className="text-center">{token}</div>
      <Button onClick={useTokenHandler}>Use Token</Button>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return { props: {} };
};
