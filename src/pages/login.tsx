import { initializeApollo } from '@/utils/apollo';
import { gql, useQuery } from '@apollo/client';

const LoginMutation = gql`
  mutation Login {
    login(email: "jennycat", password: "feedme") {
      token
    }
  }
`;

const SignupMutation = gql`
  mutation Signup {
    signup(email: "jennycat", password: "feedme", firstname: "Tom", lastname: "Kapp") {
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
  const { loading, error, data: me } = useQuery(MeQuery);

  async function logoutHandler() {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async function loginHandler() {
    await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: 'jennycat', password: 'feedme' }),
    });
  }

  async function signupHandler() {
    await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: 'jennycat', password: 'feedme' }),
    });
  }

  return (
    <div>
      {loading && <span>loading...</span>}
      {error && <pre>{error.message}</pre>}
      {me && <pre>{JSON.stringify(me.me, null, 2)}</pre>}

      <div>
        <button onClick={loginHandler}>Login</button>
      </div>
      <div>
        <button onClick={signupHandler}>Signup</button>
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
