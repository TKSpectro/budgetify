import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { Payment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';
import { Link } from '../UI/Link';
import PaymentItem from './PaymentItem';

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
      <div className="my-8">
        {payments?.map((payment: Payment) => {
          return <PaymentItem payment={payment} key={payment.id}></PaymentItem>;
        })}
      </div>
      <div className="absolute bottom-4 text-xl">
        <Link href={router.asPath + '/payments'}>
          <CurrencyDollarIcon className="w-5 h-5 mb-1 inline-block" />
          All Payments
        </Link>
      </div>
    </Container>
  );
}
