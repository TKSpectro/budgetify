import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { Payment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';
import { Link } from '../UI/Link';
import { PaymentItem } from './PaymentItem';

interface Props {
  payments: Payment[];
  t: TFunction;
}

export function PaymentOverview({ payments, t }: Props) {
  const router = useRouter();

  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <CurrencyDollarIcon className="h-8 w-8 inline-block" /> {t('common:payments')}
      </div>

      <Error
        title={t('paymentsNotFoundError')}
        error={payments?.length === 0 ? '' : undefined}
        className="mt-4"
      />

      <div className="mt-4 mb-8">
        {payments?.map((payment: Payment) => {
          return <PaymentItem payment={payment} key={payment.id}></PaymentItem>;
        })}
      </div>
      <div className="absolute bottom-4 text-xl">
        <Link href={router.asPath + '/payments'}>
          <CurrencyDollarIcon className="w-6 h-6 mb-1 inline-block" />
          {t('allPayments')}
        </Link>
      </div>
    </Container>
  );
}
