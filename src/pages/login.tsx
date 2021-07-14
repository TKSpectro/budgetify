import { useMutation, gql, useQuery } from '@apollo/client';
import { initializeApollo } from '@/utils/apollo';
import { useCookies } from 'react-cookie';

const LoginMutation = gql`
  mutation Login {
    login(email: "jennycat", password: "feedme") {
      token
    }
  }
`;

const MeQuery = gql`
  query Me {
    me {
      id
      firstname
      lastname
      email
      hashedPassword
    }
  }
`;

export default function Login() {
  const [loginFunc, { data: loginData }] = useMutation(LoginMutation);
  const { loading, error, data: me } = useQuery(MeQuery);
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  // Not logged in
  if (!cookie.token) {
    loginFunc();
  }

  function logoutHandler() {
    removeCookie('token');
  }

  if (loginData?.login?.token) {
    setCookie('token', loginData.login.token, {
      sameSite: 'lax',
      //httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 24 * 30, // 30days -> should be same as the token itself
    });
  }

  if (loading) return <span>loading...</span>;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
  if (me)
    return (
      <>
        <pre>{JSON.stringify(me, null, 2)}</pre>
        <button onClick={logoutHandler}>Logout</button>
      </>
    );

  return <div>{/* <pre>{JSON.stringify(data, null, 2)}</pre> */}</div>;
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  /*await apolloClient.mutate({
    mutation: LoginMutation,
  });*/

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
