import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@/utils/apollo';

import '../styles.css';

import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <CookiesProvider>
        <Component {...pageProps} />
      </CookiesProvider>
    </ApolloProvider>
  );
}
export default MyApp;
