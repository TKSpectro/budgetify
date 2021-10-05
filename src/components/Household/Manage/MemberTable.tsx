import { gql, useMutation } from '@apollo/client';
import { StarIcon, UserRemoveIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Error } from '~/components/UI/Error';
import { ManagedModal } from '~/components/UI/ManagedModal';
import { ModalForm } from '~/components/UI/ModalForm';
import { User } from '~/graphql/__generated__/types';
import { urlOneUp } from '~/utils/helper';
import {
  RemoveHouseholdMemberMutation,
  RemoveHouseholdMemberMutationVariables,
  UpdateHouseholdOwnerMutation,
  UpdateHouseholdOwnerMutationVariables,
} from './__generated__/MemberTable.generated';

interface Props {
  members: User[];
  owner: User;
  t: TFunction;
}

const UPDATE_HOUSEHOLD_MUTATION = gql`
  mutation updateHouseholdOwnerMutation($id: String!, $ownerId: String!) {
    updateHousehold(householdId: $id, ownerId: $ownerId) {
      id
      ownerId
    }
  }
`;

const REMOVE_HOUSEHOLD_MEMBER_MUTATION = gql`
  mutation removeHouseholdMemberMutation($id: String!, $memberId: String!) {
    removeHouseholdMember(householdId: $id, memberId: $memberId) {
      id
      members {
        id
      }
    }
  }
`;

export default function MemberTable({ members, owner, t }: Props) {
  const router = useRouter();
  const groupId = router.query.householdId as string;

  const leaveHouseholdForm = useForm();

  const [updateHouseholdMutation, { error: updateHouseholdError }] = useMutation<
    UpdateHouseholdOwnerMutation,
    UpdateHouseholdOwnerMutationVariables
  >(UPDATE_HOUSEHOLD_MUTATION, {
    onCompleted: () => {
      router.push(urlOneUp(router.asPath));
    },
    onError: () => {},
  });

  const [removeMemberMutation, { error: removeMemberError }] = useMutation<
    RemoveHouseholdMemberMutation,
    RemoveHouseholdMemberMutationVariables
  >(REMOVE_HOUSEHOLD_MEMBER_MUTATION, {
    onCompleted: () => {},
    onError: () => {},
  });

  const [makeOwnerModalUser, setMakeOwnerModalUser] = useState<User>();
  const [showMakeOwnerModal, setShowMakeOwnerModal] = useState(false);
  const onMakeOwnerClickHandler = (user: User) => {
    setMakeOwnerModalUser(user);
    setShowMakeOwnerModal(true);
  };
  const makeOwner = () => {
    updateHouseholdMutation({ variables: { id: groupId, ownerId: makeOwnerModalUser?.id || '' } });
  };

  const [removeMemberModalUser, setRemoveMemberModalUser] = useState<User>();
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const onRemoveMemberClickHandler = (user: User) => {
    setRemoveMemberModalUser(user);
    setShowRemoveMemberModal(true);
  };
  const removeHandler = () => {
    removeMemberMutation({ variables: { id: groupId, memberId: removeMemberModalUser?.id || '' } });
  };

  const onLeaveSubmit = async () => {
    await removeMemberMutation({ variables: { id: groupId, memberId: owner.id } });
    const { errors } = await updateHouseholdMutation({
      variables: { id: groupId, ownerId: leaveHouseholdForm.getValues('ownerId') },
    });

    if (!errors) router.push('/households');
  };

  return (
    <>
      <Error title={t('updateHouseholdError')} error={updateHouseholdError} />
      <Error title={t('removeMemberError')} error={removeMemberError} />

      <ManagedModal
        title={t('makeOwnerOfHousehold')}
        description={t('makeOwnerDescription', { name: makeOwnerModalUser?.name })}
        onSubmit={() => makeOwner()}
        submitText={<StarIcon className="w-6 h-6" />}
        showModal={showMakeOwnerModal}
        setShowModal={setShowMakeOwnerModal}
      />

      <ManagedModal
        title={t('removeUserFromHousehold')}
        description={t('removeUserDescription', { name: removeMemberModalUser?.name })}
        submitText={<StarIcon className="w-6 h-6" />}
        showModal={showRemoveMemberModal}
        setShowModal={setShowRemoveMemberModal}
        onSubmit={() => removeHandler()}
      />

      <table className="table-fixed w-full break-words">
        <thead>
          <tr>
            <th className="w-1/3">{t('common:name')}</th>
            <th className="w-1/3">{t('common:email')}</th>
            <th className="w-1/3">{t('common:actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {members.map((member: User) => {
            return (
              <tr key={member.id}>
                <td>
                  <div className="font-bold text-gray-800 dark:text-gray-100">{member.name}</div>
                </td>
                <td>
                  <div className="font-bold text-gray-800 dark:text-gray-100">{member.email}</div>
                </td>
                <td className="py-4">
                  {owner.id !== member.id ? (
                    <Button onClick={() => onRemoveMemberClickHandler(member)} className="mr-2">
                      <UserRemoveIcon className="w-6 h-6" />
                    </Button>
                  ) : (
                    // No need to do this one as managed because it is always just spawned once as
                    // there is always just one household owner
                    <ModalForm
                      form={leaveHouseholdForm}
                      onSubmit={onLeaveSubmit}
                      title={t('leaveHousehold')}
                      buttonText={<UserRemoveIcon className="w-6 h-6" />}
                      buttonClassName="mr-2"
                    >
                      <label>
                        {t('newOwner')}
                        <select
                          className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                          {...leaveHouseholdForm.register('ownerId', {
                            required: { value: true, message: 'Please select the new owner.' },
                          })}
                        >
                          {members.map((member) => {
                            if (member.id !== owner.id) {
                              return (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </select>
                      </label>
                    </ModalForm>
                  )}
                  {owner.id !== member.id && (
                    <Button onClick={() => onMakeOwnerClickHandler(member)}>
                      <StarIcon className="w-6 h-6" />
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
