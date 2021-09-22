import { gql, useMutation } from '@apollo/client';
import { CogIcon, TrashIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import {
  Group,
  MutationUpdateThresholdArgs,
  Threshold,
  ThresholdType,
  User,
} from '~/graphql/__generated__/types';
import { roundOn2 } from '~/utils/helper';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { Modal } from '../UI/Modal';
import { ModalForm } from '../UI/ModalForm';
import { Progressbar } from '../UI/Progressbar';

interface Props {
  me: User;
  thresholds: Threshold[];
  group: Group;
}

const UPDATE_THRESHOLD_MUTATION = gql`
  mutation UPDATE_THRESHOLD_MUTATION(
    $id: String!
    $groupId: String!
    $name: String
    $value: Money
    $type: ThresholdType
  ) {
    updateThreshold(id: $id, groupId: $groupId, name: $name, type: $type, value: $value) {
      id
      name
      value
      type
    }
  }
`;

const REMOVE_THRESHOLD_MUTATION = gql`
  mutation REMOVE_THRESHOLD_MUTATION($id: String!, $groupId: String!) {
    removeThreshold(id: $id, groupId: $groupId) {
      id
    }
  }
`;

export function ThresholdList({ me, thresholds, group }: Props) {
  const [updateThreshold, { error: updateThresholdError }] = useMutation(
    UPDATE_THRESHOLD_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['GROUP_QUERY'],
    },
  );

  const [removeThreshold, { error: removeThresholdError }] = useMutation(
    REMOVE_THRESHOLD_MUTATION,
    {
      onCompleted: () => {},
      onError: () => {},
      refetchQueries: ['GROUP_QUERY'],
    },
  );

  const updateThresholdForm = useForm<MutationUpdateThresholdArgs>({
    defaultValues: { id: '', name: '', value: 0, type: ThresholdType.Goal, groupId: '' },
  });

  const onUpdateThresholdSelectHandler = (threshold: Threshold) => {
    updateThresholdForm.reset({
      ...threshold,
    });
  };

  const onUpdateThresholdHandler = (threshold: Threshold) => {
    updateThreshold({
      variables: { ...updateThresholdForm.getValues(), id: threshold.id, groupId: group.id },
    });
  };

  const onRemoveThresholdHandler = (threshold: Threshold) => {
    removeThreshold({ variables: { id: threshold.id, groupId: group.id } });
  };

  return (
    <>
      <Error title="Could not update threshold." error={updateThresholdError} />
      <Error title="Could not remove threshold." error={removeThresholdError} />

      {thresholds.map((threshold: Threshold) => {
        return (
          <div key={threshold.id}>
            {(threshold.type === ThresholdType.Goal || threshold.type === ThresholdType.Max) && (
              <Progressbar
                progress={roundOn2((group.value / threshold.value) * 100)}
                text={threshold.name}
                type={threshold.type}
                value={threshold.value + '€'}
              />
            )}
            {/* // TODO: Figure out how to smartly show a min type threshold */}
            {threshold.type === ThresholdType.Min && (
              <Progressbar
                progress={roundOn2(
                  (threshold.value !== 0 ? group.value - threshold.value : group.value - 0) * 1,
                )}
                text={threshold.name}
                type={threshold.type}
                value={threshold.value + '€'}
              />
            )}
            {/* // TODO: Could use transparent button style but would need other placement */}
            {!!group.owners?.find((x) => x?.id === me?.id)?.id && (
              <div className="text-right">
                <ModalForm
                  form={updateThresholdForm}
                  buttonText={<CogIcon className="w-5 h-5" />}
                  buttonClassName="mr-2"
                  onSubmit={() => {
                    onUpdateThresholdHandler(threshold);
                  }}
                  onClick={() => {
                    onUpdateThresholdSelectHandler(threshold);
                  }}
                  title="Edit"
                >
                  <Input
                    label="Name"
                    type="text"
                    {...updateThresholdForm.register('name', {
                      required: { value: true, message: 'Name is required' },
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />

                  <Input
                    label="Value"
                    type="number"
                    step="any"
                    {...updateThresholdForm.register('value', {
                      required: { value: true, message: 'Value is required' },
                      valueAsNumber: true,
                    })}
                  />

                  <label>
                    Type
                    <select
                      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                      {...updateThresholdForm.register('type', {
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
                <Modal
                  buttonText={<TrashIcon className="w-5 h-5" />}
                  onSubmit={() => {
                    onRemoveThresholdHandler(threshold);
                  }}
                  title="Remove threshold"
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
