import { gql, useMutation } from '@apollo/client';
import { TagIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ManagedModalForm } from '~/components/UI/ManagedModalForm';
import { Select } from '~/components/UI/Select';
import { Category, Interval, RecurringPayment } from '~/graphql/__generated__/types';
import { dateToFormInput } from '~/utils/helper';
import {
  UpdateRecurringPaymentMutation,
  UpdateRecurringPaymentMutationVariables,
} from './__generated__/RecurringPaymentTable.generated';

interface Props {
  recurringPayments: RecurringPayment[];
  categories: Category[];
  refetch: () => void;
  t: TFunction;
}

const UPDATE_RECURRING_PAYMENT_MUTATION = gql`
  mutation updateRecurringPaymentMutation(
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

export function RecurringPaymentTable({ recurringPayments, categories, refetch, t }: Props) {
  const router = useRouter();
  const householdId = router.query.householdId as string;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const setShowUpdateModalWrapper = (value: boolean) => {
    setShowUpdateModal(value);
  };

  const [updateRecurringPaymentMutation, { error: updateRecPaymentError }] = useMutation<
    UpdateRecurringPaymentMutation,
    UpdateRecurringPaymentMutationVariables
  >(UPDATE_RECURRING_PAYMENT_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const updateRecPaymentForm = useForm<UpdateRecurringPaymentMutationVariables>();

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
      startDate: recPayment.startDate ? dateToFormInput(new Date(recPayment.startDate)) : undefined,
      endDate: recPayment.endDate ? dateToFormInput(new Date(recPayment.endDate)) : undefined,
    });
    setShowUpdateModal(true);
  };

  return (
    <Container>
      <Error title={t('updateRecurringPaymentError')} error={updateRecPaymentError} />

      <ManagedModalForm
        title={t('updateRecurringPayment')}
        submitText={t('updateRecurringPayment')}
        form={updateRecPaymentForm}
        onSubmit={() => {
          onUpdateThresholdHandler();
        }}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModalWrapper}
      >
        <Input
          label={t('common:name')}
          type="text"
          {...updateRecPaymentForm.register('name', {
            required: { value: true, message: t('common:nameMessage') },
          })}
        ></Input>
        <Input
          label={t('common:value')}
          type="number"
          {...updateRecPaymentForm.register('value', {
            required: { value: true, message: t('common:valueMessage') },
            valueAsNumber: true,
          })}
        ></Input>
        <Input
          label={t('common:description')}
          type="text"
          {...updateRecPaymentForm.register('description')}
        ></Input>

        <Select
          label={t('common:interval')}
          {...updateRecPaymentForm.register('interval', {
            required: { value: true, message: t('common:intervalMessage') },
          })}
        >
          {' '}
          <option value={Interval.Daily}>{Interval.Daily}</option>
          <option value={Interval.Weekly}>{Interval.Weekly}</option>
          <option value={Interval.Monthly}>{Interval.Monthly}</option>
          <option value={Interval.Quarterly}>{Interval.Quarterly}</option>
          <option value={Interval.Yearly}>{Interval.Yearly}</option>
        </Select>

        <Input
          label={t('common:startDate')}
          type="date"
          {...updateRecPaymentForm.register('startDate', {
            required: {
              value: true,
              message: t('startDateMessage'),
            },
            valueAsDate: true,
          })}
        ></Input>
        <Input
          label={t('common:endDate')}
          type="date"
          {...updateRecPaymentForm.register('endDate', { valueAsDate: true })}
        ></Input>

        <Select
          label={t('common:category')}
          {...updateRecPaymentForm.register('categoryId', {
            required: { value: true, message: t('common:categoryMessage') },
          })}
        >
          {categories.map((category: Category) => {
            return (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            );
          })}
        </Select>
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
                            : t('notBooked')}
                        </span>
                        <span className="hidden md:inline text-sm text-gray-500 dark:text-gray-400 ml-8">
                          {t('nextBooking') + new Date(payment.nextBooking).toDateString()}
                        </span>
                      </div>
                      <span className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('next') + new Date(payment.nextBooking).toDateString()}
                      </span>
                      <div className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('starts') + new Date(payment.startDate).toDateString()}
                      </div>
                      <div className="md:hidden ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {t('ends') + new Date(payment.endDate).toDateString()}
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
