import { gql, useQuery } from '@apollo/client';
import 'chartjs-adapter-date-fns';
import { differenceInDays, parseISO } from 'date-fns';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import { Container } from '~/components/UI/Container';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { genData } from '~/utils/charts';

const Query = gql`
  query HouseholdQuery($householdId: String) {
    household(id: $householdId) {
      id
      name
      owner {
        firstname
        lastname
      }
      payments {
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
  const { householdId } = router.query;
  const { data, loading, error } = useQuery(Query, {
    variables: { householdId },
  });

  let addedPaymentValues = 0.0;

  const labels = data.household.payments.map((payment: Payment) => payment.createdAt);
  const chartData = data.household.payments.map(
    (payment: Payment) => (addedPaymentValues += payment.value),
  );

  // If the time period is smaller than 90 days, show the labels in weeks instead of months
  if (differenceInDays(parseISO(labels[labels.length - 1]), parseISO(labels[0])) < 90) {
    paymentChartOptions.scales.xAxis.time.unit = 'week';
  }

  return (
    // TODO: Add a date filter
    <div className="mt-24 md:mx-32">
      <div className="max-w-[60em] mx-auto">
        <Line data={genData(labels, chartData)} options={paymentChartOptions} />
      </div>
      <div className="mt-16">
        <Container>
          {data.household.payments.map((payment: Payment) => {
            // TODO: Build payment component
            return (
              <div key={payment.id}>
                {payment.name} {payment.value}
              </div>
            );
          })}
        </Container>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: Query,
    variables: { householdId: ctx.params!.householdId },
  });
