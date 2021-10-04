import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Layout } from '~/components/Layout';
import { AuthProvider } from '~/utils/authTest';
import '../styles.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="theme" attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   return {
//     props: {
//       ...(await serverSideTranslations(ctx.locale || '', ['common', 'header'])),
//       ...preloadQuery(ctx, {
//         query: ME_QUERY,
//       }),
//     },
//   };
// };

// Wrap the whole app in the HOC for i18n
export default appWithTranslation(App);
