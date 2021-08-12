import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import { Payment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';

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
const rand = () => Math.round(Math.random() * 20 - 10);

const genData = () => ({
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Scale',
      data: [rand(), rand(), rand(), rand(), rand(), rand()],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
});

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

export default function Payments() {
  const router = useRouter();
  const { householdId } = router.query;
  const { data, loading, error } = useQuery(Query, {
    variables: { householdId },
  });

  return (
    <>
      <div>
        <Bar data={genData()} options={options} />
      </div>
      {data.household.payments.map((payment: Payment) => {
        // TODO: Build payment component
        return (
          <div key={payment.id}>
            {payment.name} {payment.value}
          </div>
        );
      })}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: Query,
    variables: { householdId: ctx.params!.householdId },
  });
