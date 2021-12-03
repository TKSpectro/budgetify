import { gql, useMutation } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { ModalForm } from '~/components/UI/ModalForm';
import { Select } from '~/components/UI/Select';
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
  refetch: () => void;
  t: TFunction;
}

export function NewPayment({ categories, refetch, t }: Props) {
  const router = useRouter();
  const { householdId } = router.query;

  const form = useForm<NewPaymentMutationVariables>({
    defaultValues: { householdId: householdId as string },
  });

  const [createPaymentMutation, { error: createPaymentError }] = useMutation<
    NewPaymentMutation,
    NewPaymentMutationVariables
  >(NEW_PAYMENT_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
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

  if (categories.length <= 0) {
    return null;
  }

  return (
    <>
      <Error title={t('createPaymentError')} error={createPaymentError} />

      <ModalForm
        form={form}
        onSubmit={onNewPaymentSubmit}
        title={t('newPayment')}
        buttonText={<PlusIcon className="w-6 h-6" />}
        buttonSquare
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
            step="0.01"
            {...form.register('value', {
              required: { value: true, message: t('common:valueMessage') },
            })}
          />
          <Input
            label={t('common:description')}
            type="text"
            {...form.register('description', {})}
          />

          <Select label={t('common:category')} {...form.register('categoryId', { required: true })}>
            {categories.map((category: Category) => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </Select>
        </div>
      </ModalForm>
    </>
  );
}
