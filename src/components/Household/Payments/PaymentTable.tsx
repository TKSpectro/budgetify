import { TagIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { Payment } from '~/graphql/__generated__/types';

interface Props {
  payments: Payment[];
  t: TFunction;
}

export function PaymentTable({ payments, t }: Props) {
  if (payments.length === 0) return null;

  return (
    <table className="table-fixed w-full break-words">
      <thead>
        <tr>
          <th className="w-1/4 hidden md:table-cell">{t('common:name')}</th>
          <th className="w-1/4 hidden md:table-cell">{t('common:date')}</th>
          <th className="w-1/4 hidden lg:table-cell">{t('common:category')}</th>
          <th className="w-1/4 hidden md:table-cell">{t('common:value')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-center">
        {payments.map((payment: Payment) => {
          return (
            <tr key={payment.id}>
              <td className="py-2">
                <div className="text-left items-center">
                  <TagIcon className="inline-block h-6 w-6 text-brand-500" />

                  <span className="ml-2 font-bold dark:text-gray-100">{payment.name}</span>
                  <div className="md:hidden ml-2 text-sm text-gray-400">
                    {new Date(payment.createdAt).toDateString()}
                  </div>
                  <div className="hidden md:table-cell pl-2 text-sm dark:text-gray-400">
                    {payment.description}
                  </div>
                </div>
              </td>
              <td className="hidden md:table-cell text-right dark:text-gray-400 ">
                {new Date(payment.createdAt).toDateString()}
              </td>
              <td className="hidden lg:table-cell text-center font-light dark:text-gray-400">
                {payment.category!.name}
              </td>
              <td className="text-right md:pr-8 font-bold dark:text-gray-100">
                {payment.value + '€'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
