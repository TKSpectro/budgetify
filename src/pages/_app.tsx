import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../utils/apollo';

import '../styles.css';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
