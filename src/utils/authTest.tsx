import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { createContext, useContext, useState } from 'react';

const authContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      <ApolloProvider client={auth.createApolloClient()}>{children}</ApolloProvider>
    </authContext.Provider>
  );
}

export const useAuth = (): {} => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [authToken, setAuthToken] = useState(
    typeof window === 'undefined' ? '' : localStorage.getItem('token'),
  );

  const [isSignedIn, setIsSignedIn] = useState(!!authToken);

  const getAuthHeaders = () => {
    if (!authToken) return null;

    return {
      authorization: `Bearer ${authToken}`,
    };
  };

  const createApolloClient = () => {
    return new ApolloClient({
      ssrMode: typeof window === 'undefined',
      credentials: 'same-origin',
      link: new HttpLink({
        uri: typeof window === 'undefined' ? 'http://localhost:3000/api/graphql' : '/api/graphql',
        headers: getAuthHeaders(),
      }),
      cache: new InMemoryCache({
        // https://www.apollographql.com/docs/react/pagination/core-api/#paginated-read-functions
        // typePolicies or fieldPolicies are used to customize how data is read and written
        // inside the clients cache.
        typePolicies: {
          Group: {
            fields: {
              // We need to specify the read and merge function for groupTransactions because
              // those are able to be paginated.
              transactions: {
                // Read the existing from skip to skip + limit -> standard offset pagination
                read(existing, { args }) {
                  return (
                    existing &&
                    existing.slice(args?.skip || 0, args?.skip + args?.limit || existing.length)
                  );
                },
                keyArgs: false,
                // Concatenate the incoming list with the already existing items
                merge(existing = [], incoming, { args }) {
                  const merged = existing ? existing.slice(0) : [];
                  for (let i = 0; i < incoming.length; ++i) {
                    merged[(args?.skip || 0) + i] = incoming[i];
                  }
                  return merged;
                },
              },
            },
          },
        },
      }),
    });
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    const client = createApolloClient();
    const LoginMutation = gql`
      mutation loginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    const result = await client.mutate({
      mutation: LoginMutation,
      variables: { email, password },
    });

    console.log(result);

    if (result?.data?.login?.token) {
      setAuthToken(result.data.login.token);
      setIsSignedIn(true);
      localStorage.setItem('token', result.data.login.token);
    }
  };

  const signOut = () => {
    setAuthToken('');
    setIsSignedIn(false);
    localStorage.removeItem('token');
  };

  return {
    setAuthToken,
    isSignedIn,
    signIn,
    signOut,
    createApolloClient,
  };
}
