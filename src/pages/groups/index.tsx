import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  Group,
  MutationCreateGroupArgs,
  MutationUseInviteArgs,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { uuidRegex } from '~/utils/helper';

const GROUPS_QUERY = gql`
  query GROUPS_QUERY {
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
  mutation USE_INVITE_TOKEN_MUTATION($token: String!) {
    useInvite(token: $token) {
      id
    }
  }
`;

const CREATE_GROUP_MUTATION = gql`
  mutation CREATE_GROUP_MUTATION($name: String!) {
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
  const { data, loading, error, refetch } = useQuery(GROUPS_QUERY);
  const router = useRouter();

  const form = useForm<MutationUseInviteArgs>();
  const createGroupForm = useForm<MutationCreateGroupArgs>();

  const [useGroupTokenMutation, { error: inviteError }] = useMutation(USE_INVITE_TOKEN_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: () => {},
  });

  const [createGroupMutation, { error: createGroupError }] = useMutation(CREATE_GROUP_MUTATION, {
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

  const groups = data?.me.groups;

  return (
    <Container>
      <Error title="Could not load group." error={error} />
      <Error title="Could not use invite." error={inviteError} />
      <Error title="Could not create group." error={createGroupError} />

      <Loader loading={loading} />
      <div className="mb-4 relative">
        <ModalForm
          form={form}
          buttonText="Use Invite Token"
          title="Use a Invite Token"
          onSubmit={useInviteSubmitHandler}
          submitText="Use Token"
        >
          <Input
            label="Token"
            {...form.register('token', {
              required: { value: true, message: 'Please input a token' },
              minLength: { value: 30, message: 'Please input a valid token (length)' },
              pattern: { value: uuidRegex, message: 'Please input a valid token' },
            })}
          ></Input>
        </ModalForm>
        <div className="mt-2 md:mt-0 md:absolute md:right-0 md:top-0">
          <ModalForm
            form={createGroupForm}
            buttonText="Create Group"
            title="Create a new Group"
            onSubmit={createGroupSubmitHandler}
            submitText="Create Group"
          >
            <Input
              label="Name"
              {...createGroupForm.register('name', {
                required: { value: true, message: 'Please input a name' },
                minLength: { value: 2, message: 'Please input at least 2 characters' },
              })}
            ></Input>
          </ModalForm>
        </div>
      </div>
      {groups &&
        groups.map((group: Group) => {
          return (
            <Link href={`/groups/${group.id}`} key={group.id} noUnderline>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                <div className="text-xl">{group.name}</div>
                <span className="font-light">Current value: {group.value}€</span>
              </div>
            </Link>
          );
        })}
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: GROUPS_QUERY,
  });
};
