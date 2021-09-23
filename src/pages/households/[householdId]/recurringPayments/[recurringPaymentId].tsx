import { gql, useMutation, useQuery } from '@apollo/client';
import { GetServerSideProps } from 'next';
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
import {
  Category,
  Interval,
  MutationUpdateRecurringPaymentArgs,
} from '~/graphql/__generated__/types';
import { preloadQuery } from '~/utils/apollo';
import { authenticatedRoute } from '~/utils/auth';
import { dateToFormInput } from '~/utils/helper';

const RECURRING_PAYMENT_QUERY = gql`
  query RECURRING_PAYMENT_QUERY($householdId: String, $recurringPaymentId: String) {
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
  mutation UpdateRecurringPayment(
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
  const { householdId, recurringPaymentId } = router.query;

  const { data, loading, error, refetch } = useQuery(RECURRING_PAYMENT_QUERY, {
    variables: {
      householdId,
      recurringPaymentId,
    },
  });

  const [updateRecurringPaymentMutation, { data: updateData }] = useMutation(
    UPDATE_RECURRING_PAYMENT_MUTATION,
    {
      onCompleted: () => {
        // Redirect back to recurringPayments page
        router.push(router.asPath.substring(0, router.asPath.lastIndexOf('/')));
      },
    },
  );

  const form = useForm<MutationUpdateRecurringPaymentArgs>();
  const recurringPayment = data?.household?.recurringPayments[0];
  const categories = data?.categories;

  const { reset } = form;

  useEffect(() => {
    const data: MutationUpdateRecurringPaymentArgs = {
      ...recurringPayment,
      startDate:
        recurringPayment.startDate && dateToFormInput(new Date(recurringPayment.startDate)),
      endDate: recurringPayment.endDate && dateToFormInput(new Date(recurringPayment.endDate)),
    };

    // Reset must be used here to get the form to render the actual default values
    reset(data);
  }, [recurringPayment, reset]);

  const onSubmit = (data: MutationUpdateRecurringPaymentArgs) => {
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
                  {categories.map((category: Category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
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
  return preloadQuery(ctx, {
    query: RECURRING_PAYMENT_QUERY,
    variables: {
      householdId: ctx.params!.householdId,
      recurringPaymentId: ctx.params!.recurringPaymentId,
    },
  });
};
