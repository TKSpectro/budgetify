import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { RecurringPayment } from '~/graphql/__generated__/types';
import RecurringPaymentItem from '../Household/RecurringPaymentItem';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';
import { Link } from '../UI/Link';
interface Props {
  recurringPayments: RecurringPayment[];
  t: TFunction;
}

export default function RecurringPaymentOverview({ recurringPayments, t }: Props) {
  const router = useRouter();

  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <CurrencyDollarIcon className="h-8 w-8 inline-block" /> {t('nextPayments')}
      </div>

      <Error
        title={t('recurringPaymentsNotFoundError')}
        error={recurringPayments?.length === 0 ? '' : undefined}
        className="mt-4"
      />

      <div className="mt-4 mb-8">
        {recurringPayments?.map((recPayment: RecurringPayment) => {
          return (
            <RecurringPaymentItem
              recurringPayment={recPayment}
              key={recPayment.id}
            ></RecurringPaymentItem>
          );
        })}
      </div>
      <div className="absolute bottom-4 text-xl">
        <Link href={router.asPath + '/recurringPayments'}>
          <CurrencyDollarIcon className="w-6 h-6 mb-1 inline-block" />
          {t('allPlannedPayments')}
        </Link>
      </div>
    </Container>
  );
}
