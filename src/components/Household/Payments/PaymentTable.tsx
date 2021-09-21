import { TagIcon } from '@heroicons/react/outline';
import { Container } from '~/components/UI/Container';
import { Payment } from '~/graphql/__generated__/types';

interface Props {
  payments: Payment[];
}

export function PaymentTable({ payments }: Props) {
  return (
    <Container>
      <table className="w-full">
        <tbody className="divide-y divide-gray-200 ">
          {payments.map((payment: Payment) => {
            return (
              <tr key={payment.id}>
                <td className=" py-4">
                  <div className="flex items-center">
                    <TagIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />

                    <div className="max-w-xl overflow-auto">
                      <div className="ml-2 font-bold dark:text-gray-100">
                        {payment.name}
                        <span className="hidden md:inline text-sm dark:text-gray-400 ml-8">
                          {new Date(payment.createdAt).toDateString()}
                        </span>
                      </div>
                      <span className="md:hidden ml-2 text-sm text-gray-400">
                        {new Date(payment.createdAt).toDateString()}
                      </span>
                      <div className="hidden md:table-cell pl-2 text-sm dark:text-gray-400">
                        {payment.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 hidden md:table-cell">
                  <div className="font-light dark:text-gray-400">{payment.category!.name}</div>
                </td>
                <td className="pl-4 py-4 text-right">
                  <div className="font-bold dark:text-gray-100">{payment.value + '€'}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}
