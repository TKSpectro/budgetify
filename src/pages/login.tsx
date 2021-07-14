import { useMutation, gql } from '@apollo/client';
import { initializeApollo } from '@/utils/apollo';

const MyMutation = gql`
  mutation Login {
    login(email: "jennycat", password: "feedme") {
      token
    }
  }
`;

export default function Login() {
  const [loginFunc, { data }] = useMutation(MyMutation);
  loginFunc();
  console.log(data);

  //if (loading) return <span>loading...</span>;

  return <div>{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}</div>;
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  console.log(
    await apolloClient.mutate({
      mutation: MyMutation,
    }),
  );

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
