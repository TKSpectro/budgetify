import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { ModalForm } from '~/components/UI/ModalForm';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { uuidRegex } from '~/utils/helper';
import { UseInviteTokenMutationVariables } from '../groups/__generated__/index.page.generated';
import {
  CreateHouseholdMutation,
  CreateHouseholdMutationVariables,
  HouseholdListQuery,
  HouseholdListQueryVariables,
  UseInviteTokenMutation,
} from './__generated__/index.page.generated';

const HOUSEHOLD_LIST_QUERY = gql`
  query householdListQuery {
    households {
      id
      name
      sumOfAllPayments
      owner {
        firstname
        lastname
        name
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

const CREATE_HOUSEHOLD_MUTATION = gql`
  mutation createHouseholdMutation($name: String!) {
    createHousehold(name: $name) {
      id
    }
  }
`;

export default function Households() {
  const { t } = useTranslation(['households', 'common']);

  const { data, loading, error, refetch } = useQuery<
    HouseholdListQuery,
    HouseholdListQueryVariables
  >(HOUSEHOLD_LIST_QUERY);
  const form = useForm<UseInviteTokenMutationVariables>({ defaultValues: { token: '' } });
  const createHouseholdForm = useForm<CreateHouseholdMutationVariables>({
    defaultValues: { name: '' },
  });

  const [UseInviteMutation, { error: useInviteError }] = useMutation<
    UseInviteTokenMutation,
    UseInviteTokenMutationVariables
  >(USE_INVITE_TOKEN_MUTATION, {
    onCompleted: () => {
      refetch();
      form.reset();
    },
    onError: () => {
      form.reset();
    },
  });

  const [createHouseholdMutation, { error: createHouseholdError }] = useMutation<
    CreateHouseholdMutation,
    CreateHouseholdMutationVariables
  >(CREATE_HOUSEHOLD_MUTATION, {
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

  return (
    <>
      <Head>
        <title>{t('common:households')} | budgetify</title>
      </Head>
      <Container>
        <Error title={t('common:loadingError')} error={error} />
        <Error title={t('useInviteError')} error={useInviteError} />
        <Error title={t('createHouseholdError')} error={createHouseholdError} />
        <Error
          title={t('noHouseholdsFoundError')}
          error={!loading && !error && households.length === 0 ? '' : undefined}
        />
        <Loader loading={loading} />

        <div className="mb-4 relative">
          <ModalForm
            form={form}
            buttonText={t('useInvite')}
            title={t('useInvite')}
            onSubmit={onSubmitHandler}
            submitText={t('useInvite')}
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
              form={createHouseholdForm}
              buttonText={t('createHousehold')}
              title={t('createHousehold')}
              onSubmit={createHouseholdSubmitHandler}
              submitText={t('createHousehold')}
            >
              <Input
                label="Name"
                {...createHouseholdForm.register('name', {
                  required: { value: true, message: t('householdRequiredMessage') },
                  minLength: { value: 2, message: t('householdLengthMessage') },
                })}
              ></Input>
            </ModalForm>
          </div>
        </div>

        {households?.map((household) => {
          return (
            <Link href={`/households/${household?.id}`} passHref key={household?.id}>
              <div className="border-2 border-gray-500 dark:bg-gray-800 dark:border-brand-500 p-3 mb-4 last:mb-0 rounded-lg hover:cursor-pointer">
                <div className="text-xl">
                  {household?.name}
                  <span className="float-right hidden sm:block">
                    Balance: {household?.sumOfAllPayments}€
                  </span>
                </div>
                <div className="font-light">
                  {t('owner')}: {household?.owner?.name}
                </div>
                <span className="sm:hidden">Balance: {household?.sumOfAllPayments}€</span>
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

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['households', 'common'])),
      ...(await preloadQuery(ctx, { query: HOUSEHOLD_LIST_QUERY })),
    },
  };
};
