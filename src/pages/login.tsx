import { initializeApollo } from '@/utils/apollo';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';

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

  function logoutHandler() {
    localStorage.removeItem('authToken');
  }

  function loginHandler() {
    loginFunc();
  }

  // When the loginMutation goes through we add the token to the local storage
  useEffect(() => {
    if (loginData) {
      localStorage.setItem('authToken', loginData.login.token);
    }
    return () => {};
  }, [loginData]);

  return (
    <div>
      {loading && <span>loading...</span>}
      {error && <pre>{error.message}</pre>}
      {me && <pre>{JSON.stringify(me.me, null, 2)}</pre>}

      <div>
        <button onClick={loginHandler}>Login</button>
      </div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
