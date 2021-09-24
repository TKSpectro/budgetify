import { gql, useMutation } from '@apollo/client';
import { CogIcon, TrashIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Group,
  MutationUpdateThresholdArgs,
  Threshold,
  ThresholdType,
  User,
} from '~/graphql/__generated__/types';
import { roundOn2 } from '~/utils/helper';
import { Button } from '../UI/Button';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { ManagedModal } from '../UI/ManagedModal';
import { ManagedModalForm } from '../UI/ManagedModalForm';
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const setShowUpdateModalWrapper = (value: boolean) => {
    setShowUpdateModal(value);
  };

  const [removeModalId, setRemoveModalId] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const setShowRemoveModalWrapper = (value: boolean) => {
    setShowRemoveModal(value);
  };

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
    setShowUpdateModal(true);
  };

  const onUpdateThresholdHandler = () => {
    updateThreshold({
      variables: { ...updateThresholdForm.getValues(), groupId: group.id },
    });
  };

  const onRemoveThresholdSelectHandler = (threshold: Threshold) => {
    setRemoveModalId(threshold.id);
    setShowRemoveModal(true);
  };

  const onRemoveThresholdHandler = () => {
    removeThreshold({ variables: { id: removeModalId, groupId: group.id } });
  };

  return (
    <>
      <Error title="Could not update threshold." error={updateThresholdError} />
      <Error title="Could not remove threshold." error={removeThresholdError} />

      <ManagedModalForm
        title="Edit Threshold"
        submitText="Update Threshold"
        form={updateThresholdForm}
        onSubmit={() => {
          onUpdateThresholdHandler();
        }}
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModalWrapper}
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
      </ManagedModalForm>

      <ManagedModal
        title="Remove threshold"
        submitText="Remove Threshold"
        onSubmit={() => {
          onRemoveThresholdHandler();
        }}
        showModal={showRemoveModal}
        setShowModal={setShowRemoveModalWrapper}
      />
      <div className="divide-y-4">
        {thresholds.map((threshold: Threshold) => {
          return (
            <div key={threshold.id} className="pt-2 pb-1">
              <div className="md:inline-block md:w-2/3">
                {(threshold.type === ThresholdType.Goal ||
                  threshold.type === ThresholdType.Max) && (
                  <Progressbar
                    progress={roundOn2((group.value / threshold.value) * 100)}
                    text={threshold.name}
                    type={threshold.type}
                    value={threshold.value + '€'}
                  />
                )}
                {threshold.type === ThresholdType.Min && (
                  <Progressbar
                    progress={roundOn2(
                      (threshold.value !== 0 ? group.value - threshold.value : group.value - 0) * 1,
                    )}
                    text={threshold.name}
                    type={threshold.type}
                    value={threshold.value + '€'}
                    barHidden={true}
                  />
                )}
              </div>
              {/* // TODO: Could use transparent button style but would need other placement */}
              {!!group.owners?.find((x) => x?.id === me?.id)?.id && (
                <div
                  className={clsx(
                    'md:w-1/3 flex justify-end md:justify-center md:float-right ',
                    threshold.type !== ThresholdType.Min && ' mt-1',
                  )}
                >
                  <Button onClick={() => onUpdateThresholdSelectHandler(threshold)}>
                    <CogIcon className="w-5 h-5" />
                  </Button>
                  <Button
                    className="ml-4"
                    onClick={() => onRemoveThresholdSelectHandler(threshold)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
