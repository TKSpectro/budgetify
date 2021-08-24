import { Payment, RecurringPayment } from '~/graphql/__generated__/types';
import MonthOverview from './MonthOverview';
import PaymentOverview from './PaymentOverview';
import RecurringPaymentOverview from './RecurringPaymentOverview';

interface OverviewProps {
  payments: Payment[];
  recurringPayments: RecurringPayment[];
  monthPayments: Payment[];
}

export default function Overview({ payments, recurringPayments, monthPayments }: OverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-16">
      {payments.length !== 0 && <PaymentOverview payments={payments} />}
      {recurringPayments.length !== 0 && (
        <RecurringPaymentOverview recurringPayments={recurringPayments} />
      )}
      {monthPayments.length !== 0 && <MonthOverview monthPayments={monthPayments} />}
    </div>
  );
}
