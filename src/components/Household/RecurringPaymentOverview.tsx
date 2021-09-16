import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { RecurringPayment } from '~/graphql/__generated__/types';
import RecurringPaymentItem from '../Household/RecurringPaymentItem';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';
import { Link } from '../UI/Link';
interface Props {
  recurringPayments: RecurringPayment[];
}

export default function RecurringPaymentOverview({ recurringPayments }: Props) {
  const router = useRouter();

  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <CurrencyDollarIcon className="h-8 w-8 inline-block" />
        &nbsp;Next payments
      </div>
      <Error
        title="Could not find any recurring payments."
        error={recurringPayments?.length === 0 ? '' : undefined}
      />
      <div className="my-8">
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
          <CurrencyDollarIcon className="w-5 h-5 mb-1 inline-block" />
          All planned Payments
        </Link>
      </div>
    </Container>
  );
}
