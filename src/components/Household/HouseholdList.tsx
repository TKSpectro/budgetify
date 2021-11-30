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
          <div key={household?.id} className="last:mb-0">
            <Link href={`/households/${household?.id}`} noUnderline>
              <div className="border-b-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 hover:cursor-pointer">
                <div className="text-xl">
                  {household?.name}
                  <span className="font-light text-sm float-right hidden sm:block">Balance:</span>
                </div>
                <div className="font-light text-lg">
                  {t('owner')}: {household?.owner?.name}
                  <p className="float-right hidden sm:block">{household?.sumOfAllPayments}€</p>
                </div>
                <span className="font-light text-lg sm:hidden">
                  Balance: {household?.sumOfAllPayments}€
                </span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
