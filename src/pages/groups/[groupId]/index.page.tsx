import { gql, useQuery } from '@apollo/client';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { NewTransaction } from '~/components/Group/NewTransaction';
import { ThresholdList } from '~/components/Group/ThresholdList';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { Group, Threshold, User } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { GroupQuery, GroupQueryVariables } from './__generated__/index.page.generated';

const GROUP_QUERY = gql`
  query groupQuery($id: String!, $skip: Int, $limit: Int) {
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
          id
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

export default function GroupPage() {
  const { t } = useTranslation(['groupsId', 'common']);

  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [skip, setSkip] = useState(0);

  const { data, loading, error, fetchMore } = useQuery<GroupQuery, GroupQueryVariables>(
    GROUP_QUERY,
    {
      variables: { id: groupId, skip, limit },
    },
  );

  const group = data?.group;
  const me = data?.me;

  const members = group?.members || [];
  const memberBalances = data?.calculateMemberBalances;

  const thresholds = group?.thresholds || [];

  const transactions = group?.transactions || [];
  const transactionCount = group?.transactionCount;

  return (
    <>
      <Head>
        <title>{group?.name} | budgetify</title>
      </Head>
      <Container>
        <Error title={t('common:loadingError')} error={error} />

        <Loader loading={loading} />

        {group && (
          <div className="relative text-center md:text-left">
            <div className="text-xl font-bold ">{group.name}</div>
            <div className="text-lg font-medium">
              {t('groupBalance')}: {group.value}€
            </div>

            <span className="text-right">
              <NewTransaction members={members as User[]} t={t} />
            </span>

            {data && !!group?.owners?.find((x) => x?.id === data?.me?.id) && (
              <div className="hidden md:block absolute right-48 top-2 text-base">
                <Link href={`${router.asPath}/manage`} asButton>
                  {t('common:manage')}
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>

      {thresholds && (
        <Container>
          <Disclosure text={t('common:thresholds')} showOpen className="text-lg font-semibold">
            <ThresholdList
              me={me as User}
              group={group as Group}
              thresholds={thresholds as Threshold[]}
              t={t}
            />
            <NewThreshold t={t} />
          </Disclosure>
        </Container>
      )}

      {memberBalances && (
        <Container>
          <div className="text-lg font-semibold">{t('memberBalances')}</div>
          <div className="w-full divide-y-2">
            {memberBalances.map((member) => {
              return (
                <div key={member?.userId} className="grid grid-cols-2 py-1">
                  <div>{member?.name}</div>
                  <div
                    className={clsx('text-right', {
                      'text-red-600 dark:text-red-500': member?.value < 0,
                    })}
                  >
                    {member?.value + '€'}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      )}

      {transactions && transactionCount && (
        <Container>
          <div className="text-lg font-semibold">{t('common:transactions')}</div>
          {transactions.length > 0 || transactionCount > 0 ? (
            <>
              <div className="divide-y-2">
                {transactions.map((transaction) => {
                  return (
                    <div key={transaction?.id} className="py-1 sm:px-2">
                      <Disclosure
                        text={transaction?.name + ' : ' + transaction?.value + '€'}
                        overflowText={
                          transaction?.participants?.length === 1
                            ? transaction?.participants[0]?.name
                            : ''
                        }
                        showOpen={
                          !!transaction?.participants && transaction?.participants?.length > 1
                        }
                      >
                        <div>
                          {transaction?.participants?.map((user, id, array) => {
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
                    {/* <Trans
                      defaults={`Showing <span className="font-medium">{{start}}</span> to
                      <span className="font-medium">
                        {{end}}
                      </span>
                      of <span className="font-medium">{{count}}</span> transactions`}
                      values={{
                        start: skip + 1,
                        end: skip + limit < transactionCount ? skip + limit : transactionCount,
                        count: transactionCount,
                      }}
                      components={{ span: <span /> }}
                    /> */}
                    {t('showing')} <span className="font-medium">{skip + 1}</span> {t('to')}{' '}
                    <span className="font-medium">
                      {skip + limit < transactionCount ? skip + limit : transactionCount}
                    </span>{' '}
                    {t('of')} <span className="font-medium">{transactionCount}</span>{' '}
                    {t('transactions')}
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
                    <ArrowLeftIcon className="w-6 h-6" />
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
                    <ArrowRightIcon className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Error title={t('transactionsNotFoundError')} error="" />
          )}
        </Container>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['groupsId', 'common'])),
      ...(await preloadQuery(ctx, {
        query: GROUP_QUERY,
        variables: { id: ctx.params!.groupId, limit },
      })),
    },
  };
};
