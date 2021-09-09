import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import { Group } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUPS_QUERY = gql`
  query GROUPS_QUERY {
    me {
      id
      groups {
        id
        name
        owners {
          id
        }
      }
    }
  }
`;

export default function Groups() {
  const { data, loading, error } = useQuery(GROUPS_QUERY);
  const router = useRouter();

  const groups = data?.me.groups;

  return (
    <Container>
      {loading && <LoadingAnimation />}
      <Error title="Could not load group." error={error} />
      {groups &&
        groups.map((group: Group) => {
          return (
            // TODO: Need a better way of wrapping those. Because <a> in wrapped by <a> is not allowed.
            <div
              className="relative border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer"
              key={group.id}
            >
              <Link href={`/groups/${group.id}`} noUnderline>
                <div className="text-xl">{group.name}</div>
              </Link>
              <div className="my-2 md:my-0 md:absolute right-1 top-[0.85rem] text-base z-10">
                {data && !!group?.owners?.find((x) => x?.id === data.me.id) && (
                  <Link href={`${router.asPath}/${group.id}/manage`} asButton>
                    Manage
                  </Link>
                )}
              </div>
            </div>
          );
        })}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: GROUPS_QUERY,
  });
};
