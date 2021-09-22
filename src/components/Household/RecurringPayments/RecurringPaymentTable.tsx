import { gql, useMutation } from '@apollo/client';
import { TagIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ManagedModalForm } from '~/components/UI/ManagedModalForm';
import {
  Category,
  Interval,
  MutationUpdateRecurringPaymentArgs,
  RecurringPayment,
} from '~/graphql/__generated__/types';

interface Props {
  recurringPayments: RecurringPayment[];
  categories: Category[];
}

const UPDATE_RECURRING_PAYMENT_MUTATION = gql`
  mutation UpdateRecurringPayment(
    $id: String!
    $name: String
    $value: Money
    $description: String
    $interval: Interval
    $startDate: DateTime
    $endDate: DateTime
    $categoryId: String
    $householdId: String!
  ) {
    updateRecurringPayment(
      id: $id
      name: $name
      value: $value
      description: $description
      interval: $interval
      startDate: $startDate
      endDate: $endDate
      categoryId: $categoryId
      householdId: $householdId
    ) {
      id
      name
      value
      description
      interval
      startDate
      endDate
    }
  }
`;

export function RecurringPaymentTable({ recurringPayments, categories }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const setShowUpdateModalWrapper = (value: boolean) => {
    setShowUpdateModal(value);
  };

  const [updateRecurringPaymentMutation, { error: updateRecPaymentError }] = useMutation(
    UPDATE_RECURRING_PAYMENT_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['QUERY'],
    },
  );

  const updateRecPaymentForm = useForm<MutationUpdateRecurringPaymentArgs>();

  const onUpdateThresholdHandler = () => {
    updateRecurringPaymentMutation({
      variables: {
        ...updateRecPaymentForm.getValues(),
        householdId: householdId,
      },
    });
  };

  const recurringPaymentClickHandler = (recPayment: RecurringPayment) => {
    updateRecPaymentForm.reset({
      ...recPayment,
      startDate: recPayment.startDate
        ? new Date(recPayment.startDate).toISOString().split('T')[0]
        : undefined,
      endDate: recPayment.endDate
        ? new Date(recPayment.endDate).toISOString().split('T')[0]
        : undefined,
    });
    setShowUpdateModal(true);
  };

  return (
    <Container>
      <Error title="Failed to update recurring payment." error={updateRecPaymentError} />

      <ManagedModalForm
        title="Edit Recurring Payment"
        submitText="Update Recurring Payment"
        form={updateRecPaymentForm}
        onSubmit={() => {
          onUpdateThresholdHandler();
        }}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModalWrapper}
      >
        <Input
          label="Name"
          type="text"
          {...updateRecPaymentForm.register('name', {
            required: { value: true, message: 'Name is required.' },
          })}
        ></Input>
        <Input
          label="Value"
          type="number"
          {...updateRecPaymentForm.register('value', {
            required: { value: true, message: 'Value is required.' },
            valueAsNumber: true,
          })}
        ></Input>
        <Input
          label="Description"
          type="text"
          {...updateRecPaymentForm.register('description')}
        ></Input>
        <label>
          Interval
          <select
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
            {...updateRecPaymentForm.register('interval', {
              required: { value: true, message: 'Interval is required.' },
            })}
          >
            <option value={Interval.Daily}>{Interval.Daily}</option>
            <option value={Interval.Weekly}>{Interval.Weekly}</option>
            <option value={Interval.Monthly}>{Interval.Monthly}</option>
            <option value={Interval.Quarterly}>{Interval.Quarterly}</option>
            <option value={Interval.Yearly}>{Interval.Yearly}</option>
          </select>
        </label>
        <Input
          label="StartDate"
          type="date"
          {...updateRecPaymentForm.register('startDate', {
            required: {
              value: true,
              message: 'StartDate is required.',
            },
            valueAsDate: true,
          })}
        ></Input>
        <Input
          label="EndDate"
          type="date"
          {...updateRecPaymentForm.register('endDate', { valueAsDate: true })}
        ></Input>
        <label>
          Category
          <select
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
            {...updateRecPaymentForm.register('categoryId', {
              required: { value: true, message: 'Category is required.' },
            })}
          >
            {categories.map((category: Category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </label>
      </ManagedModalForm>

      <table className="w-full">
        <tbody className="divide-y divide-gray-200 ">
          {recurringPayments.map((payment) => {
            return (
              <tr
                key={payment.id}
                onClick={() => recurringPaymentClickHandler(payment)}
                className="hover:cursor-pointer"
              >
                <td className=" py-4">
                  <div className="flex items-center">
                    <TagIcon className="flex-shrink-0 h-6 w-6 text-brand-500" />

                    <div className="max-w-xl">
                      <div className="ml-2 font-bold text-gray-800 dark:text-gray-100">
                        {payment.name}
                        <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 ml-8">
                          {payment.lastBooking
                            ? new Date(payment.lastBooking).toDateString()
                            : 'Not booked.'}
                        </span>
                        <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 ml-8">
                          {'Next booking: ' + new Date(payment.nextBooking).toDateString()}
                        </span>
                      </div>
                      <span className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {'Next: ' + new Date(payment.nextBooking).toDateString()}
                      </span>
                      <div className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {'Starts: ' + new Date(payment.startDate).toDateString()}
                      </div>
                      <div className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {'Ends: ' + new Date(payment.endDate).toDateString()}
                      </div>
                      <div className="hidden md:table-cell pl-2 text-sm text-gray-500 dark:text-gray-400">
                        {payment.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 hidden sm:table-cell">
                  <div className="font-light text-gray-500 dark:text-gray-400">
                    {payment.startDate ? new Date(payment.startDate).toDateString() : ''}
                  </div>
                </td>
                <td className="py-4 hidden md:table-cell">
                  <div className="font-light text-gray-500 dark:text-gray-400">
                    {payment.endDate ? new Date(payment.endDate).toDateString() : ''}
                  </div>
                </td>
                <td className="py-4 hidden md:table-cell">
                  <div className="font-light text-gray-500 dark:text-gray-400">
                    {payment.interval}
                  </div>
                </td>
                <td className="pl-4 py-4 text-right">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {payment.value + '€'}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
}
