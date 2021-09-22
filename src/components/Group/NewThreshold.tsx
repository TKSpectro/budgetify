import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { MutationCreateThresholdArgs, ThresholdType } from '~/graphql/__generated__/types';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { ModalForm } from '../UI/ModalForm';

const CREATE_THRESHOLD_MUTATION = gql`
  mutation CREATE_THRESHOLD_MUTATION(
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

export function NewThreshold() {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [createThreshold, { error: createThresholdError }] = useMutation(
    CREATE_THRESHOLD_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['GROUP_QUERY'],
    },
  );

  const formCreateThreshold = useForm<MutationCreateThresholdArgs>({
    defaultValues: { name: '', value: 0, groupId: groupId },
  });

  const onCreateThresholdHandler = () => {
    createThreshold({ variables: { ...formCreateThreshold.getValues(), groupId: groupId } });
  };

  return (
    <div className="mt-4 text-right">
      <Error title="Could not create threshold" error={createThresholdError} />
      <ModalForm
        title="New Threshold"
        buttonText="New Threshold"
        form={formCreateThreshold}
        submitText="Create"
        onSubmit={onCreateThresholdHandler}
      >
        <Input
          label="Name"
          type="text"
          {...formCreateThreshold.register('name', {
            required: { value: true, message: 'Name is required' },
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Input
          label="Value"
          type="number"
          step="any"
          {...formCreateThreshold.register('value', {
            required: { value: true, message: 'Value is required' },
            valueAsNumber: true,
          })}
        />

        <label>
          Type
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
