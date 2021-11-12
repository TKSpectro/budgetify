import { gql, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/dist/shared/lib/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { MemberBalancesList } from '~/components/Group/MemberBalancesList';
import { NewThreshold } from '~/components/Group/NewThreshold';
import { NewTransaction } from '~/components/Group/NewTransaction';
import { ThresholdList } from '~/components/Group/ThresholdList';
import { TransactionList } from '~/components/Group/TransactionList';
import { Container } from '~/components/UI/Container';
import { Disclosure } from '~/components/UI/Disclosure';
import { Error } from '~/components/UI/Error';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import {
  Group,
  GroupTransaction,
  Participant,
  Threshold,
  User,
} from '~/graphql/__generated__/types';
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

  const { data, loading, error, fetchMore, refetch } = useQuery<GroupQuery, GroupQueryVariables>(
    GROUP_QUERY,
    {
      variables: { id: groupId, skip, limit },
    },
  );

  const group = data?.group;
  const me = data?.me;

  const members = group?.members || [];
  const memberBalances = data?.calculateMemberBalances || [];

  const thresholds = group?.thresholds || [];

  const transactions = group?.transactions || [];
  const transactionCount = group?.transactionCount || 0;

  return (
    <>
      <Head>
        <title>{group?.name} | budgetify</title>
      </Head>
      <Container
        title={group?.name}
        action={
          <Link href={`${router.asPath}/manage`} asButton>
            {t('common:manage')}
          </Link>
        }
      >
        <Loader loading={loading} />
        <Error title={t('common:loadingError')} error={error} />

        <div className="relative text-center md:text-left">
          <div className="text-lg font-semibold">
            {t('groupBalance')}: {group?.value}€
          </div>
        </div>

        {/* // Threshold list */}
        <Disclosure text={t('common:thresholds')} showOpen className="text-lg font-medium mt-4">
          <ThresholdList
            me={me as User}
            group={group as Group}
            thresholds={thresholds as Threshold[]}
            refetch={refetch}
            t={t}
          />
          <Error
            title={t('thresholdsNotFoundError')}
            error={thresholds.length === 0 ? '' : undefined}
          />
          <NewThreshold refetch={refetch} t={t} />
        </Disclosure>
      </Container>

      {/* // Member Balances List */}
      <Container title={t('memberBalances')}>
        <MemberBalancesList memberBalances={memberBalances as Participant[]} t={t} />
      </Container>

      {/* // Transaction List */}
      <Container
        title={t('common:transactions')}
        action={<NewTransaction members={members as User[]} refetch={refetch} t={t} />}
      >
        <TransactionList
          transactions={transactions as GroupTransaction[]}
          transactionCount={transactionCount}
          skip={skip}
          limit={limit}
          fetchMore={fetchMore}
          setSkip={setSkip}
          t={t}
        />
      </Container>
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
