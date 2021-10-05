import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ThresholdType } from '~/graphql/__generated__/types';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { ModalForm } from '../UI/ModalForm';
import {
  CreateThresholdMutation,
  CreateThresholdMutationVariables,
} from './__generated__/NewThreshold.generated';

const CREATE_THRESHOLD_MUTATION = gql`
  mutation createThresholdMutation(
    $name: String!
    $value: Money!
    $type: ThresholdType!
    $groupId: String!
  ) {
    createThreshold(name: $name, value: $value, type: $type, groupId: $groupId) {
      id
      name
      value
      type
    }
  }
`;

export function NewThreshold({ t }: { t: TFunction }) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [createThreshold, { error: createThresholdError }] = useMutation<
    CreateThresholdMutation,
    CreateThresholdMutationVariables
  >(CREATE_THRESHOLD_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
    refetchQueries: ['groupQuery'],
  });

  const formCreateThreshold = useForm<CreateThresholdMutationVariables>({
    defaultValues: { name: '', value: 0, groupId: groupId },
  });

  const onCreateThresholdHandler = () => {
    createThreshold({ variables: { ...formCreateThreshold.getValues(), groupId: groupId } });
  };

  return (
    <div className="mt-4 text-right">
      <Error title={t('createThresholdError')} error={createThresholdError} />
      <ModalForm
        title={t('newThreshold')}
        buttonText={t('newThreshold')}
        form={formCreateThreshold}
        onSubmit={onCreateThresholdHandler}
        submitText={t('createThreshold')}
      >
        <Input
          label={t('common:name')}
          type="text"
          {...formCreateThreshold.register('name', {
            required: { value: true, message: t('common:nameMessage') },
          })}
        />

        <Input
          label={t('common:value')}
          type="number"
          step="any"
          {...formCreateThreshold.register('value', {
            required: { value: true, message: t('common:valueMessage') },
            valueAsNumber: true,
          })}
        />

        <label>
          {t('common:type')}
          <select
            className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
            {...formCreateThreshold.register('type', {
              required: { value: true, message: 'Please choose a type' },
            })}
          >
            <option key={ThresholdType.Goal} value={ThresholdType.Goal}>
              {ThresholdType.Goal}
            </option>
            <option key={ThresholdType.Max} value={ThresholdType.Max}>
              {ThresholdType.Max}
            </option>
            <option key={ThresholdType.Min} value={ThresholdType.Min}>
              {ThresholdType.Min}
            </option>
          </select>
        </label>
      </ModalForm>
    </div>
  );
}
