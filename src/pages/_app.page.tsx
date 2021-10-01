import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Header } from '~/components/UI/Header';
import { useApollo } from '~/utils/apollo';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
  // create the apolloClient when opening the page
  const client = useApollo(pageProps.initialClientState);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="system" storageKey="theme" attribute="class">
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
export default App;
