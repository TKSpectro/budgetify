import { gql, useMutation, useQuery } from '@apollo/client';
import 'chartjs-adapter-date-fns';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { Loader } from '~/components/UI/Loader';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { urlOneUp } from '~/utils/helper';
import {
  CategoriesQuery,
  CategoriesQueryVariables,
  NewPaymentMutation,
  NewPaymentMutationVariables,
} from './__generated__/new.page.generated';

const CATEGORIES_QUERY = gql`
  query categoriesQuery {
    categories {
      id
      name
    }
  }
`;

const NEW_PAYMENT_MUTATION = gql`
  mutation newPaymentMutation(
    $name: String!
    $value: Money!
    $description: String
    $categoryId: String!
    $householdId: String!
  ) {
    createPayment(
      name: $name
      value: $value
      description: $description
      categoryId: $categoryId
      householdId: $householdId
    ) {
      id
    }
  }
`;

// TODO: Instead of a new page just build a modal form as a component. -> DONE
// Remove after asking what is better?
export default function NewPayment() {
  const router = useRouter();
  const { householdId } = router.query;

  const { data, loading, error } = useQuery<CategoriesQuery, CategoriesQueryVariables>(
    CATEGORIES_QUERY,
  );

  const categories = data?.categories;

  const form = useForm<NewPaymentMutationVariables>({
    defaultValues: { householdId: householdId as string },
  });

  const [createPaymentMutation, { data: createPaymentData, error: createPaymentError }] =
    useMutation<NewPaymentMutation, NewPaymentMutationVariables>(NEW_PAYMENT_MUTATION, {
      variables: {
        name: form.getValues('name'),
        value: +form.getValues('value'),
        description: form.getValues('description'),
        categoryId: form.getValues('categoryId'),
        householdId: form.getValues('householdId'),
      },
    });

  const onNewPaymentSubmit = () => {
    try {
      createPaymentMutation();
    } catch (error) {
      //console.log(error);
    }
  };

  if (createPaymentData) {
    const returnUrl = urlOneUp(router.asPath);
    setTimeout(() => {
      router.push(returnUrl);
    }, 2000);
    return (
      <Container>
        Created new payment. You will get redirected shortly!
        <br />
        <Link href={returnUrl}>If not. Click here</Link>
      </Container>
    );
  }

  if (createPaymentError) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>New Payment | budgetify</title>
      </Head>

      <div className="mt-8 md:mx-32">
        <Container>
          <Error title="Could not load categories." error={error} />
          <Loader loading={loading} />

          <Form form={form} onSubmit={onNewPaymentSubmit}>
            <div className="grid gap-4">
              <Input label="Name" type="text" {...form.register('name', { required: true })} />
              <Input label="Value" type="number" {...form.register('value', { required: true })} />
              <Input label="Description" type="text" {...form.register('description', {})} />
              <label>
                Category
                <select
                  className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                  {...form.register('categoryId', { required: true })}
                >
                  {categories?.map((category) => {
                    return (
                      <option key={category?.id} value={category?.id}>
                        {category?.name}
                      </option>
                    );
                  })}
                </select>
              </label>

              <Button className="mt-2" type="submit">
                Add Payment
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
      ...(await preloadQuery(ctx, { query: CATEGORIES_QUERY })),
    },
  };
};
