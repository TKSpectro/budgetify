import { gql, useMutation, useQuery } from '@apollo/client';
import 'chartjs-adapter-date-fns';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Link } from '~/components/UI/Link';
import { LoadingAnimation } from '~/components/UI/LoadingAnimation';
import {
  Category,
  Interval,
  MutationCreateRecurringPaymentArgs,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';

const CATEGORIES_QUERY = gql`
  query CATEGORIES_QUERY {
    categories {
      id
      name
    }
  }
`;

const NEW_RECURRING_PAYMENT_MUTATION = gql`
  mutation NEW_RECURRING_PAYMENT_MUTATION(
    $name: String!
    $value: Money!
    $description: String
    $interval: Interval!
    $startDate: DateTime!
    $endDate: DateTime
    $categoryId: String!
    $householdId: String!
  ) {
    createRecurringPayment(
      name: $name
      value: $value
      description: $description
      interval: $interval
      startDate: $startDate
      endDate: $endDate
      categoryId: $categoryId
      householdId: $householdId
    ) {
      id
    }
  }
`;

export default function NewRecurringPayment() {
  const router = useRouter();
  const { householdId } = router.query;

  const {
    data: { categories },
    loading,
    error,
  } = useQuery(CATEGORIES_QUERY);

  const form = useForm<MutationCreateRecurringPaymentArgs>();
  const { reset } = form;

  const [
    createRecurringPaymentMutation,
    {
      data: createRecurringPaymentData,
      loading: createRecurringPaymentLoading,
      error: createRecurringPaymentError,
    },
  ] = useMutation(NEW_RECURRING_PAYMENT_MUTATION);

  useEffect(() => {
    // Reset must be used here to get the form to render the actual default values
    reset({
      householdId: householdId as string,
      startDate: new Date().toISOString().split('T')[0],
    });
  }, [householdId, reset]);

  const onSubmit = () => {
    try {
      createRecurringPaymentMutation({
        variables: {
          ...form.getValues(),
          value: +form.getValues('value'),
          startDate: new Date(form.getValues('startDate')!),
          endDate: form.getValues('endDate') && new Date(form.getValues('endDate')!),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (createRecurringPaymentData) {
    const returnUrl = router.asPath.substring(0, router.asPath.lastIndexOf('/'));
    setTimeout(() => {
      router.push(returnUrl);
    }, 2000);
    return (
      <Container>
        Created new recurring payment. You will get redirected shortly!
        <br />
        <Link href={returnUrl}>If not. Click here</Link>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>New Recurring Payment | budgetify</title>
      </Head>

      <div className="mt-8 md:mx-32">
        <Container>
          {loading && <LoadingAnimation />}

          <Form form={form} onSubmit={onSubmit}>
            <Input label="Name" type="text" {...form.register('name', { required: true })}></Input>
            <Input
              label="Value"
              type="number"
              {...form.register('value', { required: true })}
            ></Input>
            <Input label="Description" type="text" {...form.register('description')}></Input>
            <label>
              Interval
              <select
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                {...form.register('interval', { required: true })}
              >
                <option value={Interval.Daily}>{Interval.Daily}</option>
                <option value={Interval.Weekly}>{Interval.Weekly}</option>
                <option value={Interval.Monthly}>{Interval.Monthly}</option>
                <option value={Interval.Quarterly}>{Interval.Quarterly}</option>
                <option value={Interval.Yearly}>{Interval.Yearly}</option>
              </select>
            </label>
            <Input
              label="StartDate"
              type="date"
              {...form.register('startDate', { required: true })}
            ></Input>
            <Input label="EndDate" type="date" {...form.register('endDate')}></Input>
            <label>
              Category
              <select
                className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
                {...form.register('categoryId', { required: true })}
              >
                {categories.map((category: Category) => {
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </label>

            <Button type="submit">Create Recurring Payment</Button>
          </Form>
        </Container>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);
  return preloadQuery(ctx, {
    query: CATEGORIES_QUERY,
  });
};
