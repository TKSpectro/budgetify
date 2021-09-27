import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  Category,
  Interval,
  MutationCreateRecurringPaymentArgs,
} from '~/graphql/__generated__/types';
import { dateToFormInput } from '~/utils/helper';

interface Props {
  categories: Category[];
}

const NEW_RECURRING_PAYMENT_MUTATION = gql`
  mutation NEW_RECURRING_PAYMENT_MUTATION(
    $name: String!
    $value: Money!
    $description: String
    $interval: Interval!
    $startDate: DateTime!
    $endDate: DateTime
    $categoryId: String!
    $householdId: String!
  ) {
    createRecurringPayment(
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
    }
  }
`;

export function NewRecurringPayment({ categories }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<MutationCreateRecurringPaymentArgs>();
  const { reset } = form;

  const [createRecurringPaymentMutation, { error: createRecurringPaymentError }] = useMutation(
    NEW_RECURRING_PAYMENT_MUTATION,
    { onCompleted: () => {}, onError: () => {}, refetchQueries: ['QUERY'] },
  );

  useEffect(() => {
    // Reset must be used here to get the form to render the actual default values
    reset({
      householdId: householdId as string,
      startDate: dateToFormInput(new Date()),
    });
  }, [householdId, reset]);

  const onSubmit = () => {
    createRecurringPaymentMutation({
      variables: {
        ...form.getValues(),
      },
    });
  };

  return (
    <>
      <Error title="Could not load categories." error={createRecurringPaymentError} />

      <ModalForm
        form={form}
        onSubmit={onSubmit}
        title="New recurring payment"
        buttonText="Create recurring payment"
      >
        <Input
          label="Name"
          type="text"
          {...form.register('name', { required: { value: true, message: 'Name is required.' } })}
        ></Input>
        <Input
          label="Value"
          type="number"
          {...form.register('value', {
            required: { value: true, message: 'Value is required.' },

            valueAsNumber: true,
          })}
        ></Input>
        <Input label="Description" type="text" {...form.register('description')}></Input>
        <label>
          Interval
          <select
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
            {...form.register('interval', {
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
          {...form.register('startDate', {
            required: { value: true, message: 'StartDate is required.' },
            valueAsDate: true,
          })}
        ></Input>
        <Input
          label="EndDate"
          type="date"
          {...form.register('endDate', { valueAsDate: true })}
        ></Input>
        <label>
          Category
          <select
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
            {...form.register('categoryId', {
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
      </ModalForm>
    </>
  );
}
