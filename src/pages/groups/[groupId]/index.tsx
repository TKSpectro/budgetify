import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { CreateGroupTransaction } from '~/components/Group/CreateGroupTransaction';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { ThresholdList } from '~/components/Group/ThresholdList';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { GroupTransaction, Participant, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!) {
    me {
      id
    }
    group(id: $id) {
      id
      name
      value
      transactions {
        id
        name
        value
        participants {
          name
        }
      }
      owners {
        id
        name
      }
      members {
        id
        name
      }
      thresholds {
        id
        name
        type
        value
      }
    }
    calculateMemberBalances(id: $id) {
      name
      userId
      value
    }
  }
`;

export default function Group() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const { data, loading, error, refetch } = useQuery(GROUP_QUERY, { variables: { id: groupId } });

  const group = data?.group;
  const me = data?.me;

  const members: User[] = group?.members || [];
  const memberBalances = data?.calculateMemberBalances;

  const thresholds = group?.thresholds || [];

  return (
    <>
      <div className="grid grid-cols-1 divide-y-8 sm:divide-y-0">
        <Container>
          <Error title="Could not load group." error={error} />

          <Loader loading={loading} />

          {group && (
            <div className="relative">
              <div className="text-xl font-bold ">{group.name}</div>
              <div className="text-lg font-medium">Group balance: {group.value}€</div>

              <div className="text-right">
                <CreateGroupTransaction members={members} />
              </div>

              {/* // TODO: Style better */}
              {data && !!group?.owners?.find((x: User) => x?.id === data.me.id) && (
                <div className="hidden md:block absolute right-48 top-2 text-base">
                  <Link href={`${router.asPath}/manage`} asButton>
                    Manage
                  </Link>
                </div>
              )}
            </div>
          )}
        </Container>

        {thresholds && (
          <Container>
            <Disclosure text="Thresholds" showOpen className="text-lg font-semibold">
              <ThresholdList me={me} group={group} thresholds={thresholds} />
              <NewThreshold />
            </Disclosure>
          </Container>
        )}

        {memberBalances && (
          <Container>
            <div className="text-lg font-semibold">Member Balances</div>
            <div className="w-full divide-y-2">
              {memberBalances.map((member: Participant) => {
                return (
                  <div key={member.userId} className="grid grid-cols-2 py-1">
                    <div className="">{member.name}</div>
                    <div
                      className={clsx('text-right', {
                        'text-red-600 dark:text-red-500': member.value < 0,
                      })}
                    >
                      {member.value + '€'}
                    </div>{' '}
                  </div>
                );
              })}
            </div>
          </Container>
        )}

        {group?.transactions && (
          <Container>
            <div className="text-lg font-semibold">Transactions</div>
            <div className="divide-y-2">
              {group.transactions.map((transaction: GroupTransaction) => {
                // TODO: Need to style this a bit better
                return (
                  <div key={transaction.id}>
                    <Disclosure
                      text={transaction.name + ' : ' + transaction.value + '€'}
                      overflowText={
                        transaction.participants?.length === 1
                          ? transaction.participants[0]?.name
                          : ''
                      }
                      showOpen={!!transaction.participants && transaction.participants?.length > 1}
                    >
                      <div>
                        {transaction.participants?.map((user, id, array) => {
                          return (
                            <span key={user?.id || id}>
                              {user?.name + (id !== array.length - 1 ? ' | ' : '')}
                            </span>
                          );
                        })}
                      </div>
                    </Disclosure>
                  </div>
                );
              })}
            </div>
          </Container>
        )}
      </div>
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
