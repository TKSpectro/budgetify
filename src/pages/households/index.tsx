import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { ModalForm } from '~/components/UI/ModalForm';
import {
  Household,
  MutationCreateHouseholdArgs,
  MutationUseInviteArgs,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { uuidRegex } from '~/utils/helper';

const HOUSEHOLD_LIST_QUERY = gql`
  query HOUSEHOLD_LIST_QUERY {
    households {
      id
      name
      owner {
        firstname
        lastname
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

const CREATE_HOUESHOLD_MUTATION = gql`
  mutation ($name: String!) {
    createHousehold(name: $name) {
      id
    }
  }
`;

export default function Households() {
  const { data, loading, error, refetch } = useQuery(HOUSEHOLD_LIST_QUERY);
  const form = useForm<MutationUseInviteArgs>({ defaultValues: { token: '' } });
  const createHouseholdForm = useForm<MutationCreateHouseholdArgs>({ defaultValues: { name: '' } });

  const [UseInviteMutation, { error: useInviteError }] = useMutation(USE_INVITE_TOKEN_MUTATION, {
    onCompleted: () => {
      refetch();
      form.reset();
    },
    onError: () => {
      form.reset();
    },
  });

  const [createHouseholdMutation, { error: createHouseholdError }] =
    useMutation<MutationCreateHouseholdArgs>(CREATE_HOUESHOLD_MUTATION, {
      onCompleted: () => {
        refetch();
      },
      onError: () => {},
    });

  const onSubmitHandler = () => {
    UseInviteMutation({ variables: { token: form.getValues('token') } });
  };

  const createHouseholdSubmitHandler = () => {
    createHouseholdMutation({ variables: { ...createHouseholdForm.getValues() } });
  };

  const households = data?.households || [];

  // TODO: What info should be shown for each household?
  // Maybe even the net-value of the household?
  // Add a open button?
  return (
    <>
      <Head>
        <title>Households | budgetify</title>
      </Head>
      <Container>
        <Error title="Failed to load households." error={error} />
        <Error title="Failed to use invite token." error={useInviteError} />
        <Error title="Failed to create household." error={createHouseholdError} />
        <Error
          title="Could not find any households. Please create a new one or join one with a token."
          error={!loading && !error && households.length === 0 ? '' : undefined}
        />
        <Loader loading={loading} />

        <div className="mb-4 relative">
          <ModalForm
            form={form}
            buttonText="Use Invite Token"
            title="Use a Invite Token"
            onSubmit={onSubmitHandler}
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
              form={createHouseholdForm}
              buttonText="Create Household"
              title="Create a new Household"
              onSubmit={createHouseholdSubmitHandler}
              submitText="Create Household"
            >
              <Input
                label="Name"
                {...createHouseholdForm.register('name', {
                  required: { value: true, message: 'Please input a name' },
                  minLength: { value: 2, message: 'Please input at least 2 characters' },
                })}
              ></Input>
            </ModalForm>
          </div>
        </div>

        {households?.map((household: Household) => {
          return (
            <Link href={`/households/${household.id}`} passHref key={household.id}>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                <div className="text-xl">{household.name}</div>
                <div>
                  Owner: {household.owner?.firstname} {household.owner?.lastname}
                </div>
              </div>
            </Link>
          );
        })}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: HOUSEHOLD_LIST_QUERY,
  });
};
