import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { ModalForm } from '~/components/UI/ModalForm';
import { MutationUseInviteArgs } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { uuidRegex } from '~/utils/helper';
import {
  CreateGroupMutation,
  CreateGroupMutationVariables,
  GroupsQuery,
  GroupsQueryVariables,
  UseInviteTokenMutation,
  UseInviteTokenMutationVariables,
} from './__generated__/index.page.generated';

const GROUPS_QUERY = gql`
  query groupsQuery {
    me {
      id
      groups {
        id
        name
        value
        owners {
          id
        }
      }
    }
  }
`;

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

export default function Groups() {
  const { t } = useTranslation(['groups', 'common']);

  const { data, loading, error, refetch } = useQuery<GroupsQuery, GroupsQueryVariables>(
    GROUPS_QUERY,
  );
  const router = useRouter();

  const form = useForm<MutationUseInviteArgs>();
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

  const groups = data?.me?.groups;

  return (
    <Container>
      <Error title={t('common:loadingError')} error={error} />
      <Error title={t('useInviteError')} error={inviteError} />
      <Error title={t('createGroupError')} error={createGroupError} />

      <Loader loading={loading} />
      <div className="mb-4 relative">
        <ModalForm
          form={form}
          buttonText={t('useInvite')}
          title={t('useInvite')}
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
        <div className="mt-2 md:mt-0 md:absolute md:right-0 md:top-0">
          <ModalForm
            form={createGroupForm}
            buttonText={t('createGroup')}
            title={t('createGroup')}
            onSubmit={createGroupSubmitHandler}
          >
            <Input
              label={t('common:name')}
              {...createGroupForm.register('name', {
                required: { value: true, message: t('createGroupNameRequiredMessage') },
                minLength: { value: 2, message: t('createGroupNameNameMessage') },
              })}
            ></Input>
          </ModalForm>
        </div>
      </div>
      {groups &&
        groups.map((group) => {
          return (
            <Link href={`/groups/${group?.id}`} key={group?.id} noUnderline>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                <div className="text-xl">{group?.name}</div>
                <span className="font-light">{t('currentValue') + group?.value}€</span>
              </div>
            </Link>
          );
        })}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['groups', 'common'])),
      ...(await preloadQuery(ctx, { query: GROUPS_QUERY })),
    },
  };
};
