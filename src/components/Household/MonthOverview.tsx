import { TagIcon } from '@heroicons/react/outline';
import { Doughnut } from 'react-chartjs-2';
import { Payment } from '~/graphql/__generated__/types';
import { roundOn2 } from '~/utils/helper';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';

interface Props {
  monthPayments: Payment[];
}

export default function MonthOverview({ monthPayments: payments }: Props) {
  // The data array contains a map with payments of this month mapped by their category name and
  // the added up values spend in that category
  let data: { name: string; value: number }[] = [];

  let monthIncome = 0.0;
  let monthExpenses = 0.0;
  let monthOverall = 0.0;

  payments.map((payment) => {
    // Check if the category already exists in data. If it does just add the value,
    // else add the category as a new one
    const index = data.findIndex((x) => x.name === payment.category!.name);
    if (index !== -1) {
      data[index].value += payment.value;
    } else {
      data.push({ name: payment.category!.name, value: payment.value });
    }

    // Calculate statistics for printing them out
    monthOverall += payment.value;
    if (payment.value < 0) {
      monthExpenses += payment.value;
    } else {
      monthIncome += payment.value;
    }
  });

  // Run through the category-value pairs and set background color values for the chart
  const backgroundColors = data.map((cat) => {
    // Value is negative so color -> red
    if (cat.value < 0) {
      return 'rgba(255,56,56,0.8)';
    } // Value is positive so color -> brand / teal
    else {
      return 'rgba(20,184,166,1)';
    }
  });

  const monthlyOverviewChartData = {
    labels: data.map((pair) => pair.name),
    datasets: [
      {
        label: 'Scale',
        fill: true,
        data: data.map((pair) => pair.value),
        backgroundColor: backgroundColors,
        borderColor: ['rgba(255,255,255,0.8)'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <TagIcon className="h-8 w-8 inline-block" />
        &nbsp;This Month
      </div>

      <Error
        title="Could not find any payments this month."
        error={payments?.length === 0 ? '' : undefined}
      />

      {payments?.length !== 0 && (
        <>
          <Doughnut
            data={monthlyOverviewChartData}
            className="m-0 sm:m-8"
            options={{
              responsive: true,
              // https://www.chartjs.org/docs/latest/configuration/tooltip.html#label-callback
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      // Change tooltip text. e.g.:" Category 1: 100€"
                      return ' ' + context.label + ': ' + roundOn2(Number(context.parsed)) + '€';
                    },
                  },
                },
              },
            }}
          />
          <div className="font-bold mt-8 max-w-md grid grid-cols-2 gap-4">
            <div>Overall</div>
            <div className="text-right">{roundOn2(monthOverall)}€</div>
            <div>Income</div>
            <div className="text-right">{roundOn2(monthIncome)}€</div>
            <div>Expenses</div>
            <div className="text-right">{roundOn2(monthExpenses)}€</div>
          </div>
        </>
      )}
    </Container>
  );
}
