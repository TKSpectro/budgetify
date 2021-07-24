import { initializeApollo } from '@/utils/apollo';
import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { Button } from '~/components/UI/Button';
import { CustomLink } from '~/components/UI/CustomLink';

const LoginMutation = gql`
  mutation Login {
    login(email: "tomkaeppler@mail.de", password: "goodPassword") {
      token
    }
  }
`;

const SignupMutation = gql`
  mutation Signup {
    signup(
      email: "tomkaeppler@mail.de"
      password: "goodPassword"
      firstname: "Tom"
      lastname: "Käppler"
    ) {
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
  const [resError, setResError] = useState();

  async function logoutHandler() {
    await fetch(`${window.location.origin}/api/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // No need to check for response errors as logout cant fail
    // If the authCookie cant get deleted the user is logged-out anyways

    // TODO: Redirect to Login
  }

  async function loginHandler() {
    const res = await fetch(`${window.location.origin}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: 'tomkaeppler@mail.de', password: 'goodPassword' }),
    });

    if (res.status >= 400) {
      setResError(await res.json());
    }

    // TODO: Redirect to user dashboard if it worked
  }

  async function signupHandler() {
    const res = await fetch(`${window.location.origin}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        firstname: 'jenny',
        lastname: 'cat',
        email: 'tomkaeppler@mail.de',
        password: 'goodPassword',
      }),
    });

    if (res.status >= 400) {
      setResError(await res.json());
    }

    // TODO: Redirect to user dashboard if it worked
  }

  // TODO: Build UI and actually send the actual input data instead of fake data

  return (
    <div>
      {loading && <span>loading...</span>}
      {error && <pre>{error.message}</pre>}
      {resError && <pre>{JSON.stringify(resError, null, 2)}</pre>}
      {me && <pre>{JSON.stringify(me.me, null, 2)}</pre>}

      <Button isSubmit variant="secondary" onClick={loginHandler}>
        Login
      </Button>
      <Button onClick={signupHandler}>Signup</Button>
      <Button onClick={logoutHandler}>Logout</Button>
      <CustomLink href="/">CustomLink</CustomLink>
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
