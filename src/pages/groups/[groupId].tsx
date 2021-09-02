import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { GroupPayment } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!) {
    group(id: $id) {
      id
      name
      value
      payments {
        id
        name
        value
      }
    }
  }
`;

export default function Group() {
  const router = useRouter();
  const groupId = router.query.groupId;

  const { data, loading, error } = useQuery(GROUP_QUERY, { variables: { id: groupId } });

  const group = data?.group;

  return (
    <>
      <Container>
        {loading && <LoadingAnimation />}
        <Error title="Could not load group." error={error} />
        {group && (
          <>
            <div className="text-xl font-bold ">{group.name}</div>
            <div className="text-lg font-medium">{group.value}</div>
          </>
        )}
      </Container>
      {group.payments && (
        <Container>
          <div className="text-lg font-semibold">Payments</div>
          {group.payments.map((payment: GroupPayment) => {
            return <div key={payment.id}>{payment.name + ' : ' + payment.value + '€'}</div>;
          })}
        </Container>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: GROUP_QUERY,
    variables: {
      id: ctx.params!.groupId,
    },
  });
};
