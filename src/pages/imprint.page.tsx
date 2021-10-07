import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container } from '~/components/UI/Container';

export default function Imprint() {
  const { t } = useTranslation(['imprint', 'common']);

  return <Container>{t('common:imprint')}</Container>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'imprint'])),
    },
  };
};
