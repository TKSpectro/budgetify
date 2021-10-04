import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/UI/Button';
import { Container } from '~/components/UI/Container';
import { Error } from '~/components/UI/Error';
import { Form } from '~/components/UI/Form';
import { Input } from '~/components/UI/Input';
import { Loader } from '~/components/UI/Loader';
import { Interval } from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { dateToFormInput, urlOneUp } from '~/utils/helper';
import {
  RecurringPaymentQuery,
  RecurringPaymentQueryVariables,
  UpdateRecurringPaymentMutation,
  UpdateRecurringPaymentMutationVariables,
} from './__generated__/[recurringPaymentId].page.generated';

const RECURRING_PAYMENT_QUERY = gql`
  query recurringPaymentQuery($householdId: String, $recurringPaymentId: String) {
    household(id: $householdId) {
      id
      name
      recurringPayments(id: $recurringPaymentId) {
        id
        name
        value
        description
        createdAt
        startDate
        endDate
        nextBooking
        lastBooking
        interval
        householdId
        categoryId
        category {
          name
        }
      }
    }
    categories {
      id
      name
    }
  }
`;

const UPDATE_RECURRING_PAYMENT_MUTATION = gql`
  mutation updateRecurringPaymentMutation(
    $id: String!
    $name: String
    $value: Money
    $description: String
    $interval: Interval
    $startDate: DateTime
    $endDate: DateTime
    $categoryId: String
    $householdId: String!
  ) {
    updateRecurringPayment(
      id: $id
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
      name
      value
      description
      interval
      startDate
      endDate
    }
  }
`;

// TODO:  Instead of a new page just build a modal form as a component. Probally kinda tricky. -> DONE
// Need to remove this page.
export default function UpdateRecurringPayment() {
  const router = useRouter();
  const householdId = router.query.householdId as string;
  const recurringPaymentId = router.query.recurringPaymentId as string;

  const { data, loading, error, refetch } = useQuery<
    RecurringPaymentQuery,
    RecurringPaymentQueryVariables
  >(RECURRING_PAYMENT_QUERY, {
    variables: {
      householdId,
      recurringPaymentId,
    },
  });

  const [updateRecurringPaymentMutation, { data: updateData }] = useMutation<
    UpdateRecurringPaymentMutation,
    UpdateRecurringPaymentMutationVariables
  >(UPDATE_RECURRING_PAYMENT_MUTATION, {
    onCompleted: () => {
      // Redirect back to recurringPayments page
      router.push(urlOneUp(router.asPath));
    },
  });

  const form = useForm<UpdateRecurringPaymentMutationVariables>();
  const recurringPayments = data?.household?.recurringPayments;

  const recurringPayment = recurringPayments && recurringPayments[0];
  const categories = data?.categories;

  const { reset } = form;

  useEffect(() => {
    // Reset must be used here to get the form to render the actual default values
    reset({
      ...recurringPayment,
      startDate:
        recurringPayment?.startDate && dateToFormInput(new Date(recurringPayment?.startDate)),
      endDate: recurringPayment?.endDate && dateToFormInput(new Date(recurringPayment?.endDate)),
    });
  }, [recurringPayment, reset]);

  const onSubmit = () => {
    updateRecurringPaymentMutation({
      variables: {
        ...form.getValues(),
        startDate: new Date(form.getValues('startDate')!),
        endDate: form.getValues('endDate') && new Date(form.getValues('endDate')!),
      },
    });
  };

  return (
    <>
      <Head>
        <title>{recurringPayment?.name + ' | ' + 'budgetify'}</title>
      </Head>
      <Container>
        <Error title="Failed to load recurring payment" error={error} />
        <Error
          title="Could not find this  recurring payment."
          error={!loading && !recurringPayment ? '' : undefined}
        />
        <Loader loading={loading} />

        {!loading && !error && recurringPayment && (
          <>
            <div>Edit Recurring Payment {recurringPayment.name}</div>
            <Form form={form} onSubmit={onSubmit}>
              <Input
                label="Name"
                type="text"
                {...form.register('name', { required: true })}
              ></Input>
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
                  {categories?.map((category) => {
                    return (
                      <option key={category?.id} value={category?.id}>
                        {category?.name}
                      </option>
                    );
                  })}
                </select>
              </label>

              <Button type="submit">Update Payment</Button>
            </Form>
          </>
        )}
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  authenticatedRoute(ctx);

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common'])),
      ...(await preloadQuery(ctx, {
        query: RECURRING_PAYMENT_QUERY,
        variables: {
          householdId: ctx.params!.householdId,
          recurringPaymentId: ctx.params!.recurringPaymentId,
        },
      })),
    },
  };
};
