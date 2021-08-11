import { TagIcon } from '@heroicons/react/outline';
import { Payment } from '~/graphql/__generated__/types';
import { Container } from '../UI/Container';

interface MonthOverviewProps {
  payments: Payment[];
}

export default function MonthOverview({ payments }: MonthOverviewProps) {
  return (
    <Container>
      <div className="text-2xl text-brand-500">
        <TagIcon className="h-8 w-8 inline-block" />
        &nbsp;This Month
      </div>
      <div className="mt-8">
        Income
        <br />
        Outcome
      </div>
    </Container>
  );
}
