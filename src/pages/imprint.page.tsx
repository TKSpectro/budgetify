import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { Container } from '~/components/UI/Container';

export default function Imprint() {
  const { t } = useTranslation(['imprint', 'common']);

  return (
    <>
      <Head>
        <title>{t('common:imprint')} | budgetify</title>
      </Head>
      <Container>{t('common:imprint')}</Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'imprint'])),
    },
  };
};
