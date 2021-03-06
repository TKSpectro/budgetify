import { gql, useMutation } from '@apollo/client';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ThresholdType } from '~/graphql/__generated__/types';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { ModalForm } from '../UI/ModalForm';
import { Select } from '../UI/Select';
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

interface Props {
  refetch: () => void;
  t: TFunction;
}

export function NewThreshold({ refetch, t }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [createThreshold, { error: createThresholdError }] = useMutation<
    CreateThresholdMutation,
    CreateThresholdMutationVariables
  >(CREATE_THRESHOLD_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
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
          step="0.01"
          {...formCreateThreshold.register('value', {
            required: { value: true, message: t('common:valueMessage') },
            valueAsNumber: true,
          })}
        />

        <Select
          label={t('common:type')}
          {...formCreateThreshold.register('type', {
            required: { value: true, message: 'Please choose a type' },
          })}
        >
          {Object.values(ThresholdType).map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </Select>
      </ModalForm>
    </div>
  );
}
