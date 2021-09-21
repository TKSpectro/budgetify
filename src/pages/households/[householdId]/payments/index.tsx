import { gql, useQuery } from '@apollo/client';
import { ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
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
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { roundOn2 } from '~/utils/helper';

type DateFilterInput = {
  startDate: Date;
  endDate: Date;
};

const QUERY = gql`
  query QUERY($householdId: String, $startDate: String, $endDate: String) {
    household(id: $householdId) {
      id
      name
      payments(startDate: $startDate, endDate: $endDate) {
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
  },
  plugins: {
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
  const router = useRouter();
  const form = useForm<DateFilterInput>();

  const { householdId } = router.query;
  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables: {
      householdId,
      startDate: form.getValues('startDate') || undefined,
      endDate: form.getValues('endDate') || undefined,
    },
  });

  const payments = data?.household?.payments || [];
  const categories = data?.categories || [];

  let addedPaymentValues = 0.0;
  const labels = payments.map((payment: Payment) => payment.createdAt);
  const chartData = payments.map((payment: Payment) => (addedPaymentValues += payment.value));

  const onDateFilterSubmit = () => {
    // Re-Query with the newly set parameters
    refetch();
  };

  return (
    <>
      <Head>
        <title>Payments | budgetify</title>
      </Head>

      <div className="md:mt-8 md:mx-32">
        <>
          <Container>
            <Error title="Failed to load payments" error={error} />
            <Error
              title="Could not find any payments. Please create a new one."
              error={!loading && !error && payments.length === 0 ? '' : undefined}
            />
            <Loader loading={loading} />

            <Form form={form} onSubmit={onDateFilterSubmit}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 mb-4">
                <Input
                  className="lg:col-span-2"
                  label="StartDate"
                  type="date"
                  {...form.register('startDate', {})}
                />
                <Input
                  className="lg:col-span-2"
                  label="EndDate"
                  type="date"
                  {...form.register('endDate', {})}
                />
                <Button className="lg:mt-6" type="submit">
                  Refresh
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
              <NewPayment categories={categories} />
            </div>
          </Container>
          {payments.length !== 0 && (
            <div className="my-8">
              <PaymentTable payments={payments} />
            </div>
          )}
        </>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: QUERY,
    variables: {
      householdId: ctx.params!.householdId,
      startDate: undefined,
      endDate: undefined,
    },
  });
};
