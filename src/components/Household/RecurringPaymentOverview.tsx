import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { RecurringPayment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';
import { CustomLink } from '../UI/CustomLink';

interface RecurringPaymentOverviewProps {
  recurringPayments: RecurringPayment[];
}

export default function RecurringPaymentOverview({
  recurringPayments,
}: RecurringPaymentOverviewProps) {
  const router = useRouter();

  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <CurrencyDollarIcon className="h-8 w-8 inline-block" />
        &nbsp;Next payments
      </div>
      <div className="mt-8">
        {recurringPayments?.map((recPayment: RecurringPayment) => {
          // TODO: Build payment component
          return (
            <div key={recPayment.id}>
              {recPayment.name} {recPayment.value}
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-xl">
        <CustomLink href={router.asPath + '/payments/recurring'}>
          <CurrencyDollarIcon className="w-5 h-5 mb-1 inline-block" />
          All planned Payments
        </CustomLink>
      </div>
    </Container>
  );
}
