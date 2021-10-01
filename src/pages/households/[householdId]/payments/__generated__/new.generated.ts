import * as Types from '../../../../../graphql/__generated__/types';

export type Categories_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Categories_Query = { __typename?: 'Query', categories?: Array<{ __typename?: 'Category', id: string, name: string } | null | undefined> | null | undefined };

export type NewPaymentMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  value: Types.Scalars['Money'];
  description?: Types.Maybe<Types.Scalars['String']>;
  categoryId: Types.Scalars['String'];
  householdId: Types.Scalars['String'];
}>;


export type NewPaymentMutation = { __typename?: 'Mutation', createPayment: { __typename?: 'Payment', id: string } };
