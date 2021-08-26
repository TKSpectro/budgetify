import { gql, useQuery } from '@apollo/client';
import { StarIcon } from '@heroicons/react/outline';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Alert } from '~/components/UI/Alert';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { Modal } from '~/components/UI/Modal';
import { User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const HOUSEHOLD_QUERY = gql`
  query HOUSEHOLD_QUERY($householdId: String) {
    household(id: $householdId) {
      id
      name
      owner {
        id
        firstname
        lastname
      }
      members {
        id
        name
        email
      }
    }
  }
`;

export default function ManageHousehold() {
  const { data, loading, error } = useQuery(HOUSEHOLD_QUERY);

  const household = data?.household || {};
  const owner = household.owner || {};
  const members = household.members || [];

  const makeOwnerHandler = (id: string) => {
    // TODO: Write mutation for this
    console.log(id);
  };

  const removeHandler = (id: string) => {
    // TODO: Write mutation for this
    console.log(id);
  };

  return (
    <>
      <Head>
        <title>{'Manage ' + household.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container>
        <Error title="Failed to load household" error={error} />
        {loading && <LoadingAnimation />}
        {!loading && !household ? (
          <Alert message="Could not find this household." type="error" />
        ) : null}
        {!loading && !error && members && (
          <table className="w-full">
            <tbody className="divide-y divide-gray-200 ">
              {members.map((member: User) => {
                return (
                  <tr key={member.id} className="">
                    <td className="pl-4 py-4 w-1">
                      {member.id === owner.id && (
                        <StarIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />
                      )}
                    </td>
                    <td className="py-4">
                      <div className="max-w-xl overflow-auto">
                        <div className="ml-2 font-bold text-gray-100">{member.name}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="max-w-xl overflow-auto">
                        <div className="ml-2 font-bold text-gray-100">{member.email}</div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Modal
                        title="Remove user from household"
                        description={`Are you sure that you want to remove ${member.name} from this household?`}
                        onSubmit={() => removeHandler(member.id)}
                        buttonText="Remove"
                      />
                    </td>
                    <td className="py-4">
                      <Modal
                        title="Make owner of household"
                        description={`Are you sure that you want to make ${member.name} the new owner of this household?`}
                        onSubmit={() => makeOwnerHandler(member.id)}
                        buttonText="Make Owner"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx, undefined, ctx.query.householdId as string);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
    },
  });
};
