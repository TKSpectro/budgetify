import * as Types from '../../../../graphql/__generated__/types';

export type Household_QueryVariables = Types.Exact<{
  householdId?: Types.Maybe<Types.Scalars['String']>;
  startDate?: Types.Maybe<Types.Scalars['DateTime']>;
  endDate?: Types.Maybe<Types.Scalars['DateTime']>;
}>;


export type Household_Query = { __typename?: 'Query', me?: { __typename?: 'User', id: string } | null | undefined, household?: { __typename?: 'Household', id: string, name: string, sumOfAllPayments?: any | null | undefined, owner?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null | undefined, payments?: Array<{ __typename?: 'Payment', id: string, name: string, value: any, createdAt: any, category?: { __typename?: 'Category', id: string, name: string } | null | undefined } | null | undefined> | null | undefined, thisMonthsPayments?: Array<{ __typename?: 'Payment', name: string, value: any, createdAt: any, category?: { __typename?: 'Category', name: string } | null | undefined } | null | undefined> | null | undefined, recurringPayments?: Array<{ __typename?: 'RecurringPayment', id: string, name: string, value: any, interval: Types.Interval, nextBooking?: any | null | undefined } | null | undefined> | null | undefined } | null | undefined };
