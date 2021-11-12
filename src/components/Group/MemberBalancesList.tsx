import clsx from 'clsx';
import { TFunction } from 'next-i18next';
import { Participant } from '~/graphql/__generated__/types';
import { Error } from '../UI/Error';

interface Props {
  memberBalances: Participant[];
  t: TFunction;
}
export function MemberBalancesList({ memberBalances, t }: Props) {
  return (
    <>
      <Error
        title={t('memberBalancesNotFoundError')}
        error={memberBalances.length === 0 ? '' : undefined}
      />

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
    </>
  );
}
