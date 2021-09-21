import { RecurringPayment } from '~/graphql/__generated__/types';

interface Props {
  recurringPayment: RecurringPayment;
}

export default function RecurringPaymentItem({ recurringPayment, ...props }: Props) {
  return (
    <div className="border-t-2 first:border-t-0 last:border-b-0 border-gray-600">
      <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex text-xl">{recurringPayment.name}</span>
          </div>
          <div className="order-2 text-lg flex-shrink-0 sm:order-3 sm:ml-3">
            {recurringPayment.value}€
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pb-2 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex">{new Date(recurringPayment.nextBooking).toDateString()}</span>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            {recurringPayment.interval}
          </div>
        </div>
      </div>
    </div>
  );
}
