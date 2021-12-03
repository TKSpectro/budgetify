import { ApolloError, gql, useMutation } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/outline';
import { TFunction } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { Group } from '~/graphql/__generated__/types';
import { uuidRegex } from '~/utils/helper';
import { Container } from '../UI/Container';
import { Error } from '../UI/Error';
import { Input } from '../UI/Input';
import { Link } from '../UI/Link';
import { Loader } from '../UI/Loader';
import { ModalForm } from '../UI/ModalForm';
import {
  CreateGroupMutation,
  CreateGroupMutationVariables,
  UseInviteTokenMutation,
  UseInviteTokenMutationVariables,
} from './__generated__/GroupContainer.generated';

const USE_INVITE_TOKEN_MUTATION = gql`
  mutation useInviteTokenMutation($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

const CREATE_GROUP_MUTATION = gql`
  mutation createGroupMutation($name: String!) {
    createGroup(name: $name) {
      id
      name
      value
      members {
        id
        name
      }
    }
  }
`;

interface Props {
  groups: Group[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
  t: TFunction;
}

export function GroupContainer({ groups, loading, error, refetch, t }: Props) {
  const form = useForm<UseInviteTokenMutationVariables>();
  const createGroupForm = useForm<CreateGroupMutationVariables>();

  const [useGroupTokenMutation, { error: inviteError }] = useMutation<
    UseInviteTokenMutation,
    UseInviteTokenMutationVariables
  >(USE_INVITE_TOKEN_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [createGroupMutation, { error: createGroupError }] = useMutation<
    CreateGroupMutation,
    CreateGroupMutationVariables
  >(CREATE_GROUP_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const useInviteSubmitHandler = () => {
    useGroupTokenMutation({
      variables: {
        ...form.getValues(),
      },
    });
  };

  const createGroupSubmitHandler = () => {
    createGroupMutation({
      variables: { ...createGroupForm.getValues() },
    });
  };
  return (
    <Container
      title={t('groups')}
      action={
        <ModalForm
          form={createGroupForm}
          buttonText={<PlusIcon className="w-6 h-6" />}
          buttonSquare
          title={t('groups:createGroup')}
          onSubmit={createGroupSubmitHandler}
        >
          <Input
            label={t('common:name')}
            {...createGroupForm.register('name', {
              required: { value: true, message: t('groups:createGroupNameRequiredMessage') },
              minLength: { value: 2, message: t('groups:createGroupNameNameMessage') },
            })}
          ></Input>
        </ModalForm>
      }
      style={{ height: 'fit-content' }}
    >
      <div className="min-h-[20rem] relative">
        <div className="pb-16">
          <Error
            title={t('home:groupsNotFoundError')}
            error={groups.length === 0 ? '' : undefined}
          />
          <Error title={t('groups:useInviteError')} error={inviteError} />
          <Error title={t('groups:createGroupError')} error={createGroupError} />
          <Error title={t('common:loadingError')} error={error} />

          <Loader loading={loading} />

          {groups?.map((group) => {
            return (
              <div key={group?.id} className="last:mb-0">
                <Link href={`/groups/${group?.id}`} noUnderline>
                  <div className="border-b-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 hover:cursor-pointer">
                    <div className="text-xl">{group?.name}</div>
                    <span className="font-light">{t('groups:currentValue') + group?.value}€</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-0 w-full">
          <ModalForm
            form={form}
            buttonText={t('groups:useInvite')}
            buttonClassName="w-full absolute bottom-0"
            title={t('groups:useInvite')}
            onSubmit={useInviteSubmitHandler}
          >
            <Input
              label={t('common:token')}
              {...form.register('token', {
                required: { value: true, message: t('common:tokenRequiredMessage') },
                minLength: { value: 30, message: t('common:tokenLengthMessage') },
                pattern: { value: uuidRegex, message: t('common:tokenPatternMessage') },
              })}
            ></Input>
          </ModalForm>
        </div>
      </div>
    </Container>
  );
}
