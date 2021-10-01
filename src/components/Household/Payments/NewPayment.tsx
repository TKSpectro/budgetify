import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import { Category, MutationCreatePaymentArgs } from '~/graphql/__generated__/types';
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
}

export function NewPayment({ categories }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<MutationCreatePaymentArgs>({
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
      <Error title="Could not load create payment." error={createPaymentError} />

      <ModalForm
        form={form}
        onSubmit={onNewPaymentSubmit}
        title="New Payment"
        buttonText="New Payment"
      >
        <div className="grid gap-4">
          <Input label="Name" type="text" {...form.register('name', { required: true })} />
          <Input label="Value" type="number" {...form.register('value', { required: true })} />
          <Input label="Description" type="text" {...form.register('description', {})} />
          <label>
            Category
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
