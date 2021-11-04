import { ApolloProvider } from '@apollo/client';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Layout } from '~/components/Layout';
import { useApollo } from '~/utils/apollo';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
  // Create the apolloClient when opening the page
  const client = useApollo(pageProps.initialClientState);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="system" storageKey="theme" attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Run the app within the next-18next HOC
export default appWithTranslation(App);
