import { ApolloClient, HttpLink, InMemoryCache, QueryOptions } from '@apollo/client';
import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';

let apolloClient: ApolloClient<any>;

interface ApolloClientParameters {
  headers?: Record<string, string>;
  initialState?: Record<string, any>;
}

// Call this function to get access to a apollo client for queries to graphql
// Technically not needed because we cant just use preloadQuery for this
export function initializeApollo({ initialState, headers }: ApolloClientParameters) {
  let nextClient = apolloClient;

  if (!nextClient) {
    nextClient = new ApolloClient({
      ssrMode: typeof window === 'undefined',
      credentials: 'same-origin',
      link: new HttpLink({
        uri:
          typeof window === 'undefined'
            ? 'http://localhost:' + (process.env.PORT || 3000) + '/api/graphql'
            : '/api/graphql',
        headers: headers,
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
  }

  // Hydrate the initial state for data fetching methods
  if (initialState) {
    // Get the clients cache
    const existingCache = nextClient.extract();

    // Restore the cache from getStaticProps/getServerSideProps (data fetching methods)
    // and add the initial state to it
    nextClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return nextClient;

  // Set the apolloClient when its client-sided
  if (!apolloClient) apolloClient = nextClient;

  return nextClient;
}

// This function should only be used for creating the ApolloProvider -
// Wrapper component in _app
export function useApollo(initialState?: Record<string, any>) {
  const client = useMemo(() => initializeApollo({ initialState }), [initialState]);

  return client;
}

// This function can be used in getServerSideProps to preload queries for SSR
// You have to give the request context and also all queries you want to be loaded
export async function preloadQuery(context: GetServerSidePropsContext, ...queries: QueryOptions[]) {
  const client = initializeApollo({
    headers: context.req.headers as Record<string, string>,
  });

  try {
    // Wait for all queries to be finished
    await Promise.all(queries.map((queryOptions) => client.query(queryOptions)));
    return {
      initialClientState: client.cache.extract(),
    };
  } catch (e) {
    // Even if an error occurs return empty props so the client just can request the data again
    return {};
  }
}
