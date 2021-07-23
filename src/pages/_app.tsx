import { useApollo } from '@/utils/apollo';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
  // create the apolloClient when opening the page
  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="system" storageKey="theme" attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
}
export default App;
