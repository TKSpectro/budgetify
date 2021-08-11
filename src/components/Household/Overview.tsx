import { Payment } from '~/graphql/__generated__/types';
import MonthOverview from './MonthOverview';
import PaymentOverview from './PaymentOverview';

interface OverviewProps {
  payments: Payment[];
}

export default function Overview({ payments }: OverviewProps) {
  return (
    <div className="flex">
      <PaymentOverview payments={payments} />
      <MonthOverview payments={payments} />
    </div>
  );
}
