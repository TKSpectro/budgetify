import { useApollo } from '@/utils/apollo';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
  // create the apolloClient when opening the page
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default App;
