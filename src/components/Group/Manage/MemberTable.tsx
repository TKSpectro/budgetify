import { gql, useMutation } from '@apollo/client';
import { StarIcon, UserRemoveIcon } from '@heroicons/react/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/solid';
import { TFunction } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error } from '~/components/UI/Error';
import { Modal } from '~/components/UI/Modal';
import {
  MutationAddGroupOwnerArgs,
  MutationRemoveGroupMemberArgs,
  User,
} from '~/graphql/__generated__/types';
import {
  RemoveGroupMemberMutation,
  RemoveGroupMemberMutationVariables,
  RemoveGroupOwnerMutation,
  RemoveGroupOwnerMutationVariables,
} from './__generated__/MemberTable.generated';

interface Props {
  members: User[];
  owners: User[];
  currentUserId: String;
  refetch: () => void;
  t: TFunction;
}

const ADD_GROUP_OWNER_MUTATION = gql`
  mutation updateGroupOwnerMutation($id: String!, $ownerId: String!) {
    addGroupOwner(groupId: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_OWNER_MUTATION = gql`
  mutation removeGroupOwnerMutation($id: String!, $ownerId: String!) {
    removeGroupOwner(groupId: $id, ownerId: $ownerId) {
      id
      owners {
        id
        name
      }
    }
  }
`;

const REMOVE_GROUP_MEMBER_MUTATION = gql`
  mutation removeGroupMemberMutation($id: String!, $memberId: String!) {
    removeGroupMember(groupId: $id, memberId: $memberId) {
      id
      members {
        id
        name
      }
    }
  }
`;

export default function MemberTable({ members, owners, currentUserId, refetch, t }: Props) {
  const router = useRouter();
  const groupId = router.query.groupId as string;

  const [addGroupOwnerMutation] = useMutation<MutationAddGroupOwnerArgs>(ADD_GROUP_OWNER_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [removeGroupOwnerMutation, { error: removeOwnerError }] = useMutation<
    RemoveGroupOwnerMutation,
    RemoveGroupOwnerMutationVariables
  >(REMOVE_GROUP_OWNER_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [removeMemberMutation, { error: removeMemberError }] = useMutation<
    RemoveGroupMemberMutation,
    RemoveGroupMemberMutationVariables
  >(REMOVE_GROUP_MEMBER_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [leaveGroupMutation, { error: leaveGroupError }] =
    useMutation<MutationRemoveGroupMemberArgs>(REMOVE_GROUP_MEMBER_MUTATION, {
      onCompleted: () => {
        router.push('/groups');
      },
      onError: () => {},
    });

  const makeOwnerHandler = (id: string) => {
    addGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeOwnerHandler = (id: string) => {
    removeGroupOwnerMutation({ variables: { id: groupId, ownerId: id } });
  };

  const removeMemberHandler = (id: string) => {
    removeMemberMutation({ variables: { id: groupId, memberId: id } });
  };

  const leaveGroupHandler = (id: string) => {
    leaveGroupMutation({ variables: { id: groupId, memberId: id } });
  };

  const isOwner = !!owners.find((x) => x.id === currentUserId);

  const actionButtons = (member: User) => {
    return isOwner ? (
      <>
        {member.id !== currentUserId ? (
          <Modal
            title={t('removeMember')}
            description={t('removeMemberDescription', { name: member.name })}
            onSubmit={() => removeMemberHandler(member.id)}
            buttonText={<UserRemoveIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
            buttonClassName="mr-2"
          />
        ) : (
          <Modal
            title={t('leaveGroup')}
            description={t('leaveGroupDescription')}
            onSubmit={() => leaveGroupHandler(member.id)}
            buttonText={<UserRemoveIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
            buttonClassName="mr-2"
          />
        )}
        {!owners.find((x) => x.id === member.id) ? (
          <Modal
            title={t('giveOwnerRole')}
            description={t('giveOwnerRoleDescription', { name: member.name })}
            onSubmit={() => makeOwnerHandler(member.id)}
            buttonText={<StarIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
          />
        ) : (
          <Modal
            title={t('removeOwnerRole')}
            description={t('removeOwnerRoleDescription', { name: member.name })}
            onSubmit={() => removeOwnerHandler(member.id)}
            buttonText={<StarIconSolid className="w-4 h-4 sm:w-6 sm:h-6" />}
          />
        )}
      </>
    ) : (
      currentUserId === member.id && (
        <Modal
          title={t('leaveGroup')}
          description={t('leaveGroupDescription')}
          onSubmit={() => leaveGroupHandler(member.id)}
          buttonText={<UserRemoveIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
          buttonClassName="mr-2"
        />
      )
    );
  };

  return (
    <>
      <Error title={t('removeOwnerError')} error={removeOwnerError} />
      <Error title={t('removeMemberError')} error={removeMemberError} />
      <Error title={t('leaveGroupError')} error={leaveGroupError} />

      <table className="table-fixed w-full break-words">
        <thead>
          <tr>
            <th className="w-3/12 hidden sm:table-cell">{t('common:name')}</th>
            <th className="w-3/12 hidden sm:table-cell">{t('common:email')}</th>
            <th className="w-6/12 hidden sm:table-cell">{t('common:actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-center">
          {members.map((member: User) => {
            return (
              <tr key={member.id}>
                <td className="py-2 sm:py-4">
                  <div className=" text-gray-800 dark:text-gray-100 my-4 hidden sm:block">
                    {member.name}
                  </div>
                  <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                    {t('common:name')}
                    <span className="float-right font-normal">{member.name}</span>
                  </div>
                  <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                    {t('common:email')}
                    <span className="float-right font-normal">{member.email}</span>
                  </div>
                  <div className="sm:hidden text-left font-medium text-gray-800 dark:text-gray-100">
                    {t('common:actions')}
                    <span className="float-right font-normal">{actionButtons(member)}</span>
                  </div>
                </td>
                <td className="hidden sm:table-cell">
                  <div className=" text-gray-800 dark:text-gray-100">{member.email}</div>
                </td>
                <td className="hidden sm:table-cell">{actionButtons(member)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
