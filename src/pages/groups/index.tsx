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
import { Group } from '~/graphql/__generated__/types';
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
        owners {
          id
        }
      }
    }
  }
`;

const USE_GROUP_INVITE_TOKEN_MUTATION = gql`
  mutation USE_GROUP_INVITE_TOKEN_MUTATION($token: String!) {
    useGroupInvite(token: $token) {
      id
    }
  }
`;

export default function Groups() {
  const { data, loading, error, refetch } = useQuery(GROUPS_QUERY);
  const router = useRouter();
  const form = useForm();

  const [useGroupTokenMutation, { error: inviteError }] = useMutation(
    USE_GROUP_INVITE_TOKEN_MUTATION,
    {
      onCompleted: () => {
        refetch();
      },
      onError: () => {},
    },
  );

  const useInviteSubmitHandler = () => {
    useGroupTokenMutation({
      variables: {
        ...form.getValues(),
      },
    });
  };

  const groups = data?.me.groups;

  return (
    <Container>
      <Error title="Could not load group." error={error} />
      <Error title="Could not use invite." error={inviteError} />
      <Loader loading={loading} />

      <div className="mb-4">
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
      </div>

      {groups &&
        groups.map((group: Group) => {
          return (
            // TODO: Need a better way of wrapping those. Because <a> in wrapped by <a> is not allowed.
            <div
              className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer"
              key={group.id}
            >
              <Link href={`/groups/${group.id}`} noUnderline>
                <div className="text-xl">{group.name}</div>
              </Link>
            </div>
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
