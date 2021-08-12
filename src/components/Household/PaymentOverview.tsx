import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Payment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';
import { CustomLink } from '../UI/CustomLink';

interface PaymentOverviewProps {
  payments: Payment[];
}

export default function PaymentOverview({ payments }: PaymentOverviewProps) {
  const router = useRouter();

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
      <div className="mt-8 text-xl">
        <CustomLink href={router.asPath + '/payments'}>
          <CurrencyDollarIcon className="w-5 h-5 mb-1 inline-block" />
          All Payments
        </CustomLink>
      </div>
    </Container>
  );
}
