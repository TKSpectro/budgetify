import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import { setContext } from '@apollo/client/link/context';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from cookies if it exists
//   const token = document.cookie
//     ? document.cookie
//         .split('; ')
//         .find((row) => row.startsWith('token='))
//         .split('=')[1]
//     : '';
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token,
//     },
//   };
// });

// Create a link that is either server or client based
function createIsomorphicLink() {
  if (typeof window === 'undefined') {
    //server
    const { SchemaLink } = require('@apollo/client/link/schema');
    const { schema } = require('@/graphql/schema');
    return new SchemaLink({ schema });
  } else {
    //client
    const { HttpLink } = require('@apollo/client/link/http');

    //return authLink.concat(new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' }));
    return new HttpLink({ uri: '/api/graphql', credentials: 'same-origin' });
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphicLink(),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = {}) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  // server-side
  if (typeof window === 'undefined') {
    return _apolloClient;
  }
  apolloClient = apolloClient ?? _apolloClient;

  return apolloClient;
}

export function useApollo(initialState = {}) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);

  return store;
}
