import { Payment } from '~/graphql/__generated__/types';

interface Props {
  payment: Payment;
}

export default function PaymentItem({ payment }: Props) {
  return (
    <div className="border-t-2 first:border-t-0 border-gray-600">
      <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex text-xl">{payment.name}</span>
          </div>
          <div className="order-2 text-lg flex-shrink-0 sm:order-3 sm:ml-3">{payment.value}€</div>
        </div>
      </div>
      <div className="mb-2 px-3 sm:px-6 lg:px-8">{new Date(payment.createdAt).toDateString()}</div>
    </div>
  );
}
