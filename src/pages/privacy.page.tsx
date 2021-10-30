import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Container } from '~/components/UI/Container';

export default function Privacy() {
  const { t } = useTranslation(['privacy', 'common']);

  return (
    <>
      <Head>
        <title>{t('common:privacy')} | budgetify</title>
      </Head>
      <Container>{t('common:privacy')}</Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'privacy'])),
    },
  };
};
