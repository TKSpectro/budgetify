import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import { Select } from '~/components/UI/Select';
import { Category, Interval } from '~/graphql/__generated__/types';
import { dateToFormInput } from '~/utils/helper';
import {
  NewRecurringPaymentMutation,
  NewRecurringPaymentMutationVariables,
} from './__generated__/NewRecurringPayment.generated';

interface Props {
  categories: Category[];
  refetch: () => void;
  t: TFunction;
}

const NEW_RECURRING_PAYMENT_MUTATION = gql`
  mutation newRecurringPaymentMutation(
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

export function NewRecurringPayment({ categories, refetch, t }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<NewRecurringPaymentMutationVariables>();
  const { reset } = form;

  const [createRecurringPaymentMutation, { error: createRecurringPaymentError }] = useMutation<
    NewRecurringPaymentMutation,
    NewRecurringPaymentMutationVariables
  >(NEW_RECURRING_PAYMENT_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

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
      <Error title={t('createRecurringPaymentError')} error={createRecurringPaymentError} />

      <ModalForm
        form={form}
        onSubmit={onSubmit}
        title={t('createRecurringPayment')}
        buttonText={t('createRecurringPayment')}
      >
        <Input
          label={t('common:name')}
          type="text"
          {...form.register('name', {
            required: { value: true, message: t('common:nameMessage') },
          })}
        ></Input>
        <Input
          label={t('common:value')}
          type="number"
          {...form.register('value', {
            required: { value: true, message: t('common:valueMessage') },

            valueAsNumber: true,
          })}
        ></Input>
        <Input
          label={t('common:description')}
          type="text"
          {...form.register('description')}
        ></Input>

        <Select
          label={t('common:interval')}
          {...form.register('interval', {
            required: { value: true, message: t('common:intervalMessage') },
          })}
        >
          {Object.values(Interval).map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </Select>

        <Input
          label="StartDate"
          type="date"
          {...form.register('startDate', {
            required: { value: true, message: t('common:startDateMessage') },
            valueAsDate: true,
          })}
        ></Input>

        <Input
          label="EndDate"
          type="date"
          {...form.register('endDate', { valueAsDate: true })}
        ></Input>

        <Select
          label={t('common:category')}
          {...form.register('categoryId', {
            required: { value: true, message: t('common:categoryMessage') },
          })}
        >
          {categories?.map((category: Category) => {
            return (
              <option key={category?.id} value={category?.id}>
                {category?.name}
              </option>
            );
          })}
        </Select>
      </ModalForm>
    </>
  );
}
