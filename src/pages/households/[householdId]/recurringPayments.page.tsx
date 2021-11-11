import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NewRecurringPayment } from '~/components/Household/RecurringPayments/NewRecurringPayment';
import { RecurringPaymentTable } from '~/components/Household/RecurringPayments/RecurringPaymentTable';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Loader } from '~/components/UI/Loader';
import { Category, RecurringPayment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { Query, QueryVariables } from './__generated__/recurringPayments.page.generated';

const QUERY = gql`
  query QUERY($householdId: String) {
    household(id: $householdId) {
      id
      name
      recurringPayments {
        id
        name
        value
        description
        createdAt
        startDate
        endDate
        nextBooking
        lastBooking
        interval
        category {
          name
        }
      }
    }
    categories {
      id
      name
    }
  }
`;

export default function RecurringPayments() {
  const { t } = useTranslation(['householdsIdRecPayments', 'common']);

  const router = useRouter();
  const householdId = router.query.householdId as string;

  const { data, loading, error, refetch } = useQuery<Query, QueryVariables>(QUERY, {
    variables: {
      householdId,
    },
  });

  const recurringPayments = data?.household?.recurringPayments || [];
  const categories = data?.categories || [];

  return (
    <>
      <Head>
        <title>{t('common:recurringPayments')} | budgetify</title>
      </Head>

      <Container
        title={t('common:recurringPayments')}
        action={
          <NewRecurringPayment categories={categories as Category[]} refetch={refetch} t={t} />
        }
      >
        <Error title={t('common:loadingError')} error={error} />
        <Error
          title={t('recurringPaymentsNotFoundError')}
          error={!loading && !error && recurringPayments?.length === 0 ? '' : undefined}
        />
        <Loader loading={loading} />
        <div className="sm:mt-8">
          <RecurringPaymentTable
            recurringPayments={recurringPayments as RecurringPayment[]}
            categories={categories as Category[]}
            refetch={refetch}
            t={t}
          />
        </div>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['householdsIdRecPayments', 'common'])),
      ...(await preloadQuery(ctx, {
        query: QUERY,
        variables: { householdId: ctx.params!.householdId },
      })),
    },
  };
};
