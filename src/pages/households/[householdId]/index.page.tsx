import { gql, useQuery } from '@apollo/client';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import MonthOverview from '~/components/Household/MonthOverview';
import PaymentOverview from '~/components/Household/PaymentOverview';
import RecurringPaymentOverview from '~/components/Household/RecurringPaymentOverview';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { Payment, RecurringPayment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';
import { HouseholdQuery, HouseholdQueryVariables } from './__generated__/index.page.generated';

const HOUSEHOLD_QUERY = gql`
  query householdQuery($householdId: String, $startDate: DateTime, $endDate: DateTime) {
    me {
      id
    }
    household(id: $householdId) {
      id
      name
      owner {
        id
        firstname
        lastname
      }
      payments(limit: 6) {
        id
        name
        value
        createdAt
        category {
          id
          name
        }
      }
      sumOfAllPayments
      thisMonthsPayments: payments(startDate: $startDate, endDate: $endDate) {
        name
        value
        createdAt
        category {
          name
        }
      }
      recurringPayments(limit: 6) {
        id
        name
        value
        interval
        nextBooking
      }
    }
  }
`;

export default function Household() {
  const { t } = useTranslation(['householdsId', 'common']);

  const router = useRouter();
  const householdId = router.query.householdId as string;

  const { data, loading, error } = useQuery<HouseholdQuery, HouseholdQueryVariables>(
    HOUSEHOLD_QUERY,
    {
      variables: {
        householdId,
        startDate: new Date(startOfMonth(new Date())).toISOString(),
        endDate: new Date(endOfMonth(new Date())).toISOString(),
      },
    },
  );

  const household = data?.household;
  const payments = household?.payments || [];
  const sumOfAllPayments = household?.sumOfAllPayments || 0;

  const isOwner = household?.owner?.id === data?.me?.id;

  return (
    <div className="sm:mx-24">
      <Head>
        <title>{household?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Error title={t('common:loadingError')} error={error} />
      <Error title={t('householdNotFoundError')} error={!loading && !household ? '' : undefined} />
      <Loader loading={loading} />

      {!error && household && (
        <>
          <div className="mx-4 my-4">
            <div className="relative text-6xl text-brand-500">
              {household.name}
              <span className="hidden md:block absolute right-4 top-6 text-base">
                <Link href={router.asPath + '/manage'} asButton>
                  {t('common:manage')}
                </Link>
              </span>
            </div>

            <div className="mt-4 text-4xl">
              {t('totalBalance') + ' ' + roundOn2(sumOfAllPayments) + '€'}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 lg:gap-x-16 overflow-auto">
            <PaymentOverview payments={payments as Payment[]} t={t} />

            <RecurringPaymentOverview
              recurringPayments={household?.recurringPayments as RecurringPayment[]}
              t={t}
            />

            <MonthOverview monthPayments={household?.thisMonthsPayments as Payment[]} t={t} />
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['householdsId', 'common'])),
      ...(await preloadQuery(ctx, {
        query: HOUSEHOLD_QUERY,
        variables: {
          householdId: ctx.params!.householdId,
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
        },
      })),
    },
  };
};
