import { TagIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Container } from '~/components/UI/Container';
import { RecurringPayment } from '~/graphql/__generated__/types';

interface Props {
  recurringPayments: RecurringPayment[];
}

export function RecurringPaymentTable({ recurringPayments }: Props) {
  const router = useRouter();

  const recurringPaymentClickHandler = (recPayment: RecurringPayment) => {
    router.push(router.asPath + '/' + recPayment.id);
  };

  return (
    <Container>
      <table className="w-full">
        <tbody className="divide-y divide-gray-200 ">
          {recurringPayments.map((payment) => {
            return (
              <tr key={payment.id} onClick={() => recurringPaymentClickHandler(payment)}>
                <td className=" py-4">
                  <div className="flex items-center">
                    <TagIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />

                    <div className="max-w-xl">
                      <div className="ml-2 font-bold text-gray-100">
                        {payment.name}
                        <span className="hidden md:inline text-sm text-gray-400 ml-8">
                          {payment.lastBooking
                            ? new Date(payment.lastBooking).toLocaleDateString()
                            : 'Not booked.'}
                        </span>
                        <span className="hidden md:inline text-sm text-gray-400 ml-8">
                          {'Next booking: ' + new Date(payment.nextBooking).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="md:hidden ml-2 text-sm text-gray-400">
                        {'Next: ' + new Date(payment.nextBooking).toLocaleDateString()}
                      </span>
                      <div className="md:hidden ml-2 text-sm text-gray-400">
                        {'Starts: ' + new Date(payment.startDate).toLocaleDateString()}
                      </div>
                      <div className="md:hidden ml-2 text-sm text-gray-400">
                        {'Ends: ' + new Date(payment.endDate).toLocaleDateString()}
                      </div>
                      <div className="hidden md:table-cell pl-2 text-sm text-gray-400">
                        {payment.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <div className="font-light text-gray-400">
                    {payment.startDate ? new Date(payment.startDate).toLocaleDateString() : ''}
                  </div>
                </td>
                <td className="py-4 hidden md:table-cell">
                  <div className="font-light text-gray-400">
                    {payment.endDate ? new Date(payment.endDate).toLocaleDateString() : ''}
                  </div>
                </td>
                <td className="py-4 hidden md:table-cell">
                  <div className="font-light text-gray-400">{payment.interval}</div>
                </td>
                <td className="pl-4 py-4 text-right">
                  <div className="font-bold text-gray-100">{payment.value + '€'}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}
