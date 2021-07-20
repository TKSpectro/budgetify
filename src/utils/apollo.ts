import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;

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
