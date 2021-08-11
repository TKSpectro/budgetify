import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { Payment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';

interface PaymentOverviewProps {
  payments: Payment[];
}

export default function PaymentOverview({ payments }: PaymentOverviewProps) {
  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <CurrencyDollarIcon className="h-8 w-8 inline-block" />
        &nbsp;Payments
      </div>
      <div className="mt-8">
        {payments.map((payment: Payment) => {
          // TODO: Build payment component
          return (
            <div key={payment.id}>
              {payment.name} {payment.value}
            </div>
          );
        })}
      </div>
    </Container>
  );
}
