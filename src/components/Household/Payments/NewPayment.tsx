import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import { Category } from '~/graphql/__generated__/types';
import {
  NewPaymentMutation,
  NewPaymentMutationVariables,
} from './__generated__/NewPayment.generated';

const NEW_PAYMENT_MUTATION = gql`
  mutation newPaymentMutation(
    $name: String!
    $value: Money!
    $description: String
    $categoryId: String!
    $householdId: String!
  ) {
    createPayment(
      name: $name
      value: $value
      description: $description
      categoryId: $categoryId
      householdId: $householdId
    ) {
      id
    }
  }
`;

interface Props {
  categories: Category[];
  t: TFunction;
}

export function NewPayment({ categories, t }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<NewPaymentMutationVariables>({
    defaultValues: { householdId: householdId as string },
  });

  const [createPaymentMutation, { error: createPaymentError }] = useMutation<
    NewPaymentMutation,
    NewPaymentMutationVariables
  >(NEW_PAYMENT_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
    refetchQueries: ['HOUSEHOLD_PAYMENTS_QUERY'],
  });

  const onNewPaymentSubmit = () => {
    createPaymentMutation({
      variables: {
        name: form.getValues('name'),
        value: +form.getValues('value'),
        description: form.getValues('description'),
        categoryId: form.getValues('categoryId'),
        householdId: form.getValues('householdId'),
      },
    });
  };

  return (
    <>
      <Error title={t('createPaymentError')} error={createPaymentError} />

      <ModalForm
        form={form}
        onSubmit={onNewPaymentSubmit}
        title={t('newPayment')}
        buttonText={t('newPayment')}
      >
        <div className="grid gap-4">
          <Input
            label={t('common:name')}
            type="text"
            {...form.register('name', {
              required: { value: true, message: t('common:nameMessage') },
            })}
          />
          <Input
            label={t('common:value')}
            type="number"
            {...form.register('value', {
              required: { value: true, message: t('common:valueMessage') },
            })}
          />
          <Input
            label={t('common:description')}
            type="text"
            {...form.register('description', {})}
          />
          <label>
            {t('common:category')}
            <select
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
              {...form.register('categoryId', { required: true })}
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
        </div>
      </ModalForm>
    </>
  );
}
