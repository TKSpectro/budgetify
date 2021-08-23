import { gql, useQuery } from '@apollo/client';
import 'chartjs-adapter-date-fns';
import { differenceInDays, parseISO } from 'date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { Alert } from '~/components/UI/Alert';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { genData } from '~/utils/charts';

type DateFilterInput = {
  startDate: Date;
  endDate: Date;
};

const HOUSEHOLD_PAYMENT_QUERY = gql`
  query HOUSEHOLD_PAYMENT_QUERY($householdId: String, $startDate: String, $endDate: String) {
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
  }
`;

let paymentChartOptions = {
  responsive: true,
  scales: {
    xAxis: {
      type: 'time',
      time: {
        unit: 'month',
        displayFormats: {
          quarter: 'MMM YYYY',
        },
      },
    },
  },
};

export default function Payments() {
  const router = useRouter();
  const form = useForm<DateFilterInput>();

  const { householdId } = router.query;
  const { data, loading, error, refetch } = useQuery(HOUSEHOLD_PAYMENT_QUERY, {
    variables: {
      householdId,
      startDate: form.getValues('startDate') || undefined,
      endDate: form.getValues('endDate') || undefined,
    },
  });

  const payments = data?.household?.payments || [];

  let addedPaymentValues = 0.0;

  if (loading) return <div>loading</div>;

  const labels = payments.map((payment: Payment) => payment.createdAt);
  const chartData = payments.map((payment: Payment) => (addedPaymentValues += payment.value));

  // Adjust the label unit by the difference in days.
  if (differenceInDays(parseISO(labels[labels.length - 1]), parseISO(labels[0])) < 2) {
    paymentChartOptions.scales.xAxis.time.unit = 'hour';
  } else if (differenceInDays(parseISO(labels[labels.length - 1]), parseISO(labels[0])) < 14) {
    paymentChartOptions.scales.xAxis.time.unit = 'day';
  } else if (differenceInDays(parseISO(labels[labels.length - 1]), parseISO(labels[0])) < 90) {
    paymentChartOptions.scales.xAxis.time.unit = 'week';
  }

  const onDateFilterSubmit = () => {
    // Todo: Could be optimized by not querying the whole household but just the payments for the household
    // Re-Query with the newly set parameters
    refetch();
  };

  return (
    <>
      <Head>
        <title>Payments | budgetify</title>
      </Head>

      <div className="mt-8 md:mx-32">
        <Error title="Failed to load recurring messages" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !error && payments.length === 0 ? (
          <Alert
            message="Could not find any recurring messages. Please create a new one"
            type="warning"
          />
        ) : (
          <>
            <Form form={form} onSubmit={onDateFilterSubmit}>
              <div className="mx-8 md:mx-0 md:grid md: grid-cols-3">
                <Input
                  className="mx-4"
                  label="StartDate"
                  type="date"
                  {...form.register('startDate', {})}
                />
                <Input label="EndDate" type="date" {...form.register('endDate', {})} />
                <Button className="mt-4 w-full md:w-auto md:my-auto md:mx-auto" type="submit">
                  Refresh
                </Button>
              </div>
            </Form>

            <div className="max-w-[60em] mx-auto">
              <Line data={genData(labels, chartData)} options={paymentChartOptions} />
            </div>

            <div className="mt-16">
              <Link href={router.asPath + '/newPayment'} asButton>
                New Payment
              </Link>

              <Container>
                {payments.map((payment: Payment) => {
                  // TODO: Build payment component
                  return (
                    <div key={payment.id}>
                      {payment.name} {payment.value}
                    </div>
                  );
                })}
              </Container>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_PAYMENT_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
      startDate: undefined,
      endDate: undefined,
    },
  });
};
