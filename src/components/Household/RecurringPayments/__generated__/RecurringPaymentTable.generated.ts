import * as Types from '../../../../graphql/__generated__/types';

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
