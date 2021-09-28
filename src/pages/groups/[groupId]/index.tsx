import { gql, useQuery } from '@apollo/client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CreateGroupTransaction } from '~/components/Group/CreateGroupTransaction';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { ThresholdList } from '~/components/Group/ThresholdList';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { GroupTransaction, Participant, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const GROUP_QUERY = gql`
  query GROUP_QUERY($id: String!, $skip: Int, $limit: Int) {
    me {
      id
    }
    group(groupId: $id) {
      id
      name
      value
      transactionCount
      transactions(skip: $skip, limit: $limit) {
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

const limit = 10;

export default function Group() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [skip, setSkip] = useState(0);

  const { data, loading, error, fetchMore } = useQuery(GROUP_QUERY, {
    variables: { id: groupId, skip, limit },
  });

  const group = data?.group;
  const me = data?.me;

  const members: User[] = group?.members || [];
  const memberBalances = data?.calculateMemberBalances;

  const thresholds = group?.thresholds || [];

  const transactions = group?.transactions || [];
  const transactionCount = group?.transactionCount;

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

        {transactions && (
          <Container>
            <div className="text-lg font-semibold">Transactions</div>
            {transactions.length > 0 || transactionCount > 0 ? (
              <>
                <div className="divide-y-2">
                  {transactions.map((transaction: GroupTransaction) => {
                    // TODO: Need to style this a bit better
                    return (
                      <div key={transaction.id} className="py-1 sm:px-2">
                        <Disclosure
                          text={transaction.name + ' : ' + transaction.value + '€'}
                          overflowText={
                            transaction.participants?.length === 1
                              ? transaction.participants[0]?.name
                              : ''
                          }
                          showOpen={
                            !!transaction.participants && transaction.participants?.length > 1
                          }
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

                <div className="px-4 mt-4 sm:flex sm:items-center sm:justify-between sm:px-6 select-none">
                  <div className="hidden sm:flex">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      Showing <span className="font-medium">{skip + 1}</span> to{' '}
                      <span className="font-medium">
                        {skip + limit < transactionCount ? skip + limit : transactionCount}
                      </span>{' '}
                      of <span className="font-medium">{transactionCount}</span> transactions
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      disabled={skip - limit < 0}
                      onClick={() => {
                        fetchMore({ variables: { skip: skip - limit < 0 ? 0 : skip - limit } });
                        setSkip(skip - limit < 0 ? 0 : skip - limit);
                      }}
                      className="flex"
                      variant="transparent"
                    >
                      <ArrowLeftIcon className="w-5 h-5" />
                    </Button>

                    <Button
                      disabled={skip + limit >= transactionCount}
                      onClick={() => {
                        fetchMore({ variables: { skip: skip + limit } });
                        setSkip(skip + limit);
                      }}
                      className="ml-4 flex"
                      variant="transparent"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Error title="Could not find any transactions. Create your first one" error="" />
            )}
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
      limit,
    },
  });
};
