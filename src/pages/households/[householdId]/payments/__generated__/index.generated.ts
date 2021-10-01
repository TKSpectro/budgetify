import * as Types from '../../../../../graphql/__generated__/types';

export type Household_Payments_QueryVariables = Types.Exact<{
  householdId?: Types.Maybe<Types.Scalars['String']>;
  startDate?: Types.Maybe<Types.Scalars['DateTime']>;
  endDate?: Types.Maybe<Types.Scalars['DateTime']>;
  calcBeforeStartDate?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type Household_Payments_Query = { __typename?: 'Query', household?: { __typename?: 'Household', id: string, name: string, payments?: Array<{ __typename?: 'Payment', id: string, name: string, value: any, description?: string | null | undefined, createdAt: any, category?: { __typename?: 'Category', id: string, name: string } | null | undefined, user?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null | undefined } | null | undefined> | null | undefined } | null | undefined, categories?: Array<{ __typename?: 'Category', id: string, name: string } | null | undefined> | null | undefined };
