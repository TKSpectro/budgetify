import { useApollo } from '@/utils/apollo';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import '../styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
