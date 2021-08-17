import { Payment, RecurringPayment } from '~/graphql/__generated__/types';
import MonthOverview from './MonthOverview';
import PaymentOverview from './PaymentOverview';
import RecurringPaymentOverview from './RecurringPaymentOverview';

interface OverviewProps {
  payments: Payment[];
  recurringPayments: RecurringPayment[];
}

export default function Overview({ payments, recurringPayments }: OverviewProps) {
  return (
    <div className="grid lg:grid-cols-3 lg:gap-4">
      <PaymentOverview payments={payments} />
      <RecurringPaymentOverview recurringPayments={recurringPayments} />
      <MonthOverview payments={payments} />
    </div>
  );
}
