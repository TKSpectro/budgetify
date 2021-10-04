import * as Types from '../../../../../graphql/__generated__/types';

export type QueryVariables = Types.Exact<{
  householdId?: Types.Maybe<Types.Scalars['String']>;
}>;


export type Query = { __typename?: 'Query', household?: { __typename?: 'Household', id: string, name: string, recurringPayments?: Array<{ __typename?: 'RecurringPayment', id: string, name: string, value: any, description?: string | null | undefined, createdAt: any, startDate: any, endDate?: any | null | undefined, nextBooking?: any | null | undefined, lastBooking?: any | null | undefined, interval: Types.Interval, category?: { __typename?: 'Category', name: string } | null | undefined } | null | undefined> | null | undefined } | null | undefined, categories?: Array<{ __typename?: 'Category', id: string, name: string } | null | undefined> | null | undefined };
