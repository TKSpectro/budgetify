import { gql, useQuery } from '@apollo/client';
import { ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { startOfMonth, subMonths } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { NewPayment } from '~/components/Household/Payments/NewPayment';
import { PaymentTable } from '~/components/Household/Payments/PaymentTable';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { Category, Payment, Scalars } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { dateToFormInput, roundOn2 } from '~/utils/helper';
import {
  HouseholdPaymentsQuery,
  HouseholdPaymentsQueryVariables,
} from './__generated__/index.page.generated';

type DateFilterInput = {
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};

const QUERY = gql`
  query householdPaymentsQuery(
    $householdId: String
    $startDate: DateTime
    $endDate: DateTime
    $calcBeforeStartDate: Boolean
  ) {
    household(id: $householdId) {
      id
      name
      payments(
        startDate: $startDate
        endDate: $endDate
        calcBeforeStartDate: $calcBeforeStartDate
      ) {
        id
        name
        value
        description
        createdAt
        category {
          id
          name
        }
        user {
          id
          firstname
          lastname
        }
      }
    }
    categories {
      id
      name
    }
  }
`;

let paymentChartOptions: ChartOptions = {
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month',
      },
      // Enable automatic scaling for the ticks
      ticks: { source: 'auto' },
    },
    y: {
      ticks: {
        // Include a euro sign in the ticks
        callback: function (value) {
          return value + '€';
        },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function (this) {
          return (
            'Balance: ' +
            roundOn2(this.dataPoints[0].dataset.data[this.dataPoints[0].dataIndex] as number) +
            '€'
          );
        },
      },
    },
  },
};

export default function Payments() {
  const { t } = useTranslation(['householdsIdPayments', 'common']);

  const router = useRouter();
  const householdId = router.query.householdId as string;

  const form = useForm<DateFilterInput>();

  const [startDateSave, setStartDateSave] = useState(
    dateToFormInput(startOfMonth(subMonths(new Date(), 3))),
  );

  const { data, loading, error, refetch } = useQuery<
    HouseholdPaymentsQuery,
    HouseholdPaymentsQueryVariables
  >(QUERY, {
    variables: {
      householdId,
      startDate: form.getValues('startDate') || startOfMonth(subMonths(new Date(), 3)),
      endDate: form.getValues('endDate') || undefined,
      calcBeforeStartDate: true,
    },
  });

  useEffect(() => {
    form.setValue('startDate', startDateSave);
  });

  let payments = data?.household?.payments || [];
  const categories = data?.categories || [];

  // The payments array we receive will have a startValue Payment at the start.
  // In this we get all payments before the startDate added up, so we can
  // show the correct starting value
  let addedPaymentValues = 0.0;
  if (payments.length > 0) {
    // Set the starting value to the fake payments value and then remove the first
    // element from the array
    addedPaymentValues = payments[0]?.value;
    payments = payments.slice(1);
  }
  const labels = payments.map((payment) => payment?.createdAt);
  const chartData = payments.map((payment) => (addedPaymentValues += payment?.value));

  const onDateFilterSubmit = () => {
    // Re-Query with the newly set parameters
    setStartDateSave(dateToFormInput(form.getValues('startDate')));
    refetch();
  };

  return (
    <>
      <Head>
        <title>{t('common:payments')} | budgetify</title>
      </Head>

      <div>
        <>
          <Container>
            <Error title={t('common:loadingError')} error={error} />
            <Error
              title={t('noPaymentsFoundError')}
              error={!loading && !error && payments.length === 0 ? '' : undefined}
            />

            <Form form={form} onSubmit={onDateFilterSubmit}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 mb-4">
                <Input
                  className="lg:col-span-2"
                  label={t('common:startDate')}
                  type="date"
                  {...form.register('startDate', { valueAsDate: true })}
                />
                <Input
                  className="lg:col-span-2"
                  label={t('common:endDate')}
                  type="date"
                  {...form.register('endDate', { valueAsDate: true })}
                />
                <Button className="lg:mt-8" type="submit">
                  {t('common:refresh')}
                </Button>
              </div>
            </Form>

            <div className="max-w-[60em] mx-auto">
              <Line
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: 'Scale',
                      fill: true,
                      data: chartData,
                      backgroundColor: ['rgba(255,255,255,0.04)'],
                      borderColor: ['rgba(20, 184, 166, 1)'],
                      borderWidth: 1,
                      tension: 0.2,
                    },
                  ],
                }}
                options={paymentChartOptions}
              />
            </div>
            <div className="mt-8 flex flex-row-reverse">
              <NewPayment categories={categories as Category[]} t={t} />
            </div>
          </Container>
          <Container>
            <Loader loading={loading} />
            <PaymentTable payments={payments as Payment[]} t={t} />
          </Container>
        </>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['householdsIdPayments', 'common'])),
      ...(await preloadQuery(ctx, {
        query: QUERY,
        variables: {
          householdId: ctx.params!.householdId,
          startDate: startOfMonth(subMonths(new Date(), 3)),
          endDate: undefined,
          calcBeforeStartDate: true,
        },
      })),
    },
  };
};
