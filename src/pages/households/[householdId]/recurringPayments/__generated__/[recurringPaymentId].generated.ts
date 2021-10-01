import * as Types from '../../../../../graphql/__generated__/types';

export type Recurring_Payment_QueryVariables = Types.Exact<{
  householdId?: Types.Maybe<Types.Scalars['String']>;
  recurringPaymentId?: Types.Maybe<Types.Scalars['String']>;
}>;


export type Recurring_Payment_Query = { __typename?: 'Query', household?: { __typename?: 'Household', id: string, name: string, recurringPayments?: Array<{ __typename?: 'RecurringPayment', id: string, name: string, value: any, description?: string | null | undefined, createdAt: any, startDate: any, endDate?: any | null | undefined, nextBooking?: any | null | undefined, lastBooking?: any | null | undefined, interval: Types.Interval, householdId: string, categoryId: string, category?: { __typename?: 'Category', name: string } | null | undefined } | null | undefined> | null | undefined } | null | undefined, categories?: Array<{ __typename?: 'Category', id: string, name: string } | null | undefined> | null | undefined };

export type UpdateRecurringPaymentMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  name?: Types.Maybe<Types.Scalars['String']>;
  value?: Types.Maybe<Types.Scalars['Money']>;
  description?: Types.Maybe<Types.Scalars['String']>;
  interval?: Types.Maybe<Types.Interval>;
  startDate?: Types.Maybe<Types.Scalars['DateTime']>;
  endDate?: Types.Maybe<Types.Scalars['DateTime']>;
  categoryId?: Types.Maybe<Types.Scalars['String']>;
  householdId: Types.Scalars['String'];
}>;


export type UpdateRecurringPaymentMutation = { __typename?: 'Mutation', updateRecurringPayment: { __typename?: 'RecurringPayment', id: string, name: string, value: any, description?: string | null | undefined, interval: Types.Interval, startDate: any, endDate?: any | null | undefined } };
