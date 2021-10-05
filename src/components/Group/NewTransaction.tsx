import { gql, useMutation } from '@apollo/client';
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TransactionType, User } from '~/graphql/__generated__/types';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { ModalForm } from '../UI/ModalForm';
import { Switch } from '../UI/Switch';
import { UserMultiSelect } from './UserMultiselect';
import {
  CreateGroupTransactionMutation,
  CreateGroupTransactionMutationVariables,
} from './__generated__/NewTransaction.generated';

const CREATE_GROUP_TRANSACTION_MUTATION = gql`
  mutation createGroupTransactionMutation(
    $name: String!
    $value: Money!
    $type: TransactionType!
    $groupId: String!
    $participantIds: [String!]!
  ) {
    createGroupTransaction(
      name: $name
      value: $value
      type: $type
      groupId: $groupId
      participantIds: $participantIds
    ) {
      id
    }
  }
`;

interface Props {
  members: User[];
  refetch: () => void;
  t: TFunction;
}

export function NewTransaction({ members, refetch, t }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [createGroupTransaction, { error: createGroupTransactionError }] = useMutation<
    CreateGroupTransactionMutation,
    CreateGroupTransactionMutationVariables
  >(CREATE_GROUP_TRANSACTION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const formCreateGroupTransaction = useForm<CreateGroupTransactionMutationVariables>({
    defaultValues: { name: '', value: 0, groupId: groupId as string, participantIds: [] },
  });

  const onSubmitHandler = () => {
    // if the user is topping up his account we overwrite the participantIds with an empty array
    // so its more consistent on the database layer
    if (formStateIsCashout) {
      createGroupTransaction({
        variables: {
          ...formCreateGroupTransaction.getValues(),
          // Force the value to be negative as the user input will be positive
          value: -Math.abs(formCreateGroupTransaction.getValues('value')),
          type: formStateIsBuyingFood ? TransactionType.Buy : TransactionType.TakeOut,
          // Check if the all user switch is set depending on that we take all group members
          // or just the ones that are checked.
          participantIds: formAllGroupMembers
            ? members.map((member) => member.id)
            : formCreateGroupTransaction.getValues('participantIds'),
        },
      });
    } else {
      // Top up
      createGroupTransaction({
        variables: {
          ...formCreateGroupTransaction.getValues(),
          type: TransactionType.TopUp,
          participantIds: [],
        },
      });
    }
  };

  // Need to handle the participantIds with a custom function which will get called from the UserPicker
  const setValueHandlerParticipantIds = (members: User[]) => {
    formCreateGroupTransaction.setValue(
      'participantIds',
      members.map((member) => member.id),
    );
  };

  const [formStateIsCashout, setFormStateIsCashout] = useState(false);
  const [formStateIsBuyingFood, setFormStateIsBuyingFood] = useState(true);
  const [formAllGroupMembers, setFormAllGroupMembers] = useState(true);
  return (
    <>
      <Error title="Could not create transaction." error={createGroupTransactionError} />
      <ModalForm
        title={t('newTransaction')}
        buttonText={t('newTransaction')}
        buttonClassName="md:absolute right-4 top-2 text-base"
        form={formCreateGroupTransaction}
        submitText={t('createTransaction')}
        description={t('createTransactionDescription')}
        onSubmit={onSubmitHandler}
      >
        <label>
          <span className={clsx(formStateIsCashout && 'text-gray-400')}>{t('topUpBalance')}</span> |
          <span className={clsx(!formStateIsCashout && 'text-gray-400')}>
            {' '}
            {t('takeOutMoney')}/{t('boughtFood')}
          </span>
          <Switch
            isLeft={formStateIsCashout}
            onClick={() => setFormStateIsCashout(!formStateIsCashout)}
            leftIcon={<PlusIcon className="w-4 h-4 " />}
            rightIcon={<MinusIcon className="w-4 h-4 text-brand-400" />}
          />
        </label>

        <Input
          label={t('common:name')}
          type="text"
          {...formCreateGroupTransaction.register('name', {
            required: { value: true, message: t('common:nameMessage') },
          })}
        />

        {formStateIsCashout && (
          <div className="mt-2">
            <label>
              <span className={clsx(formStateIsBuyingFood && 'text-gray-400')}>
                {t('takeOutMoney')}
              </span>{' '}
              |
              <span className={clsx(!formStateIsBuyingFood && 'text-gray-400')}>
                {' '}
                {t('boughtFood')}
              </span>
              <Switch
                isLeft={formStateIsBuyingFood}
                onClick={() => setFormStateIsBuyingFood(!formStateIsBuyingFood)}
                leftIcon={<XIcon className="w-4 h-4 " />}
                rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
              />
            </label>
          </div>
        )}

        <Input
          label={t('common:value')}
          type="number"
          step="any"
          {...formCreateGroupTransaction.register('value', {
            required: { value: true, message: t('common:valueMessage') },
            min: { value: 0, message: t('valueMustBePositive') },
            valueAsNumber: true,
          })}
        />

        {formStateIsCashout && formStateIsBuyingFood && (
          <div className="mt-2">
            <label>
              {t('allGroupMembers')}
              <Switch
                isLeft={formAllGroupMembers}
                onClick={() => setFormAllGroupMembers(!formAllGroupMembers)}
                leftIcon={<XIcon className="w-4 h-4 " />}
                rightIcon={<CheckIcon className="w-4 h-4 text-brand-400" />}
              />
            </label>
          </div>
        )}

        {formStateIsCashout && !formAllGroupMembers && (
          <UserMultiSelect
            items={members}
            setValue={setValueHandlerParticipantIds}
            {...formCreateGroupTransaction.register('participantIds')}
          />
        )}
      </ModalForm>
    </>
  );
}
