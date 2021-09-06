import { Payment, RecurringPayment } from '~/graphql/__generated__/types';
import MonthOverview from './MonthOverview';
import PaymentOverview from './PaymentOverview';
import RecurringPaymentOverview from './RecurringPaymentOverview';

interface Props {
  payments: Payment[];
  recurringPayments: RecurringPayment[];
  monthPayments: Payment[];
}

export default function Overview({ payments, recurringPayments, monthPayments }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-16 overflow-auto">
      {payments.length !== 0 && <PaymentOverview payments={payments} />}
      {recurringPayments.length !== 0 && (
        <RecurringPaymentOverview recurringPayments={recurringPayments} />
      )}
      {monthPayments.length !== 0 && <MonthOverview monthPayments={monthPayments} />}
    </div>
  );
}
