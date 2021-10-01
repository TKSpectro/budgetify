import * as Types from '../../../../../graphql/__generated__/types';

export type Categories_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Categories_Query = { __typename?: 'Query', categories?: Array<{ __typename?: 'Category', id: string, name: string } | null | undefined> | null | undefined };

export type NewRecurringPaymentMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  value: Types.Scalars['Money'];
  description?: Types.Maybe<Types.Scalars['String']>;
  interval: Types.Interval;
  startDate: Types.Scalars['DateTime'];
  endDate?: Types.Maybe<Types.Scalars['DateTime']>;
  categoryId: Types.Scalars['String'];
  householdId: Types.Scalars['String'];
}>;


export type NewRecurringPaymentMutation = { __typename?: 'Mutation', createRecurringPayment: { __typename?: 'RecurringPayment', id: string } };
