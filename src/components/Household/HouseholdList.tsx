import { TFunction } from 'next-i18next';
import { Household } from '~/graphql/__generated__/types';
import { Link } from '../UI/Link';

interface Props {
  households: Household[];
  t: TFunction;
}

export function HouseholdList({ households, t }: Props) {
  return (
    <div>
      {households?.map((household) => {
        return (
          <div key={household?.id} className="mb-4 last:mb-0">
            <Link href={`/households/${household?.id}`} noUnderline>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 rounded-lg hover:cursor-pointer">
                <div className="text-xl">
                  {household?.name}
                  <span className="float-right hidden sm:block">
                    Balance: {household?.sumOfAllPayments}€
                  </span>
                </div>
                <div className="font-light">
                  {t('owner')}: {household?.owner?.name}
                </div>
                <span className="sm:hidden">Balance: {household?.sumOfAllPayments}€</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
