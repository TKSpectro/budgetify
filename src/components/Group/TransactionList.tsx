import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { GroupTransaction } from '~/graphql/__generated__/types';
import { Button } from '../UI/Button';
import { Disclosure } from '../UI/Disclosure';
import { Error } from '../UI/Error';

interface Props {
  transactions: GroupTransaction[];
  transactionCount: number;
  skip: number;
  limit: number;
  fetchMore: any;
  setSkip: any;
  t: TFunction;
}

export function TransactionList({
  transactions,
  transactionCount,
  skip,
  limit,
  fetchMore,
  setSkip,
  t,
}: Props) {
  return (
    <>
      <Error
        title={t('transactionsNotFoundError')}
        error={transactions.length <= 0 || transactionCount <= 0 ? '' : undefined}
      />

      <div className="divide-y-2">
        {transactions.map((transaction) => {
          return (
            <div key={transaction?.id} className="py-1 sm:px-2">
              <Disclosure
                text={transaction?.name + ' : ' + transaction?.value + '€'}
                overflowText={
                  transaction?.participants?.length === 1 ? transaction?.participants[0]?.name : ''
                }
                showOpen={!!transaction?.participants && transaction?.participants?.length > 1}
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
            {t('showing')} <span className="font-medium">{skip + 1}</span> {t('to')}{' '}
            <span className="font-medium">
              {skip + limit < transactionCount ? skip + limit : transactionCount}
            </span>{' '}
            {t('of')} <span className="font-medium">{transactionCount}</span> {t('transactions')}
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
  );
}
