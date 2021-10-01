import * as Types from '../../../graphql/__generated__/types';

export type Household_List_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Household_List_Query = { __typename?: 'Query', households?: Array<{ __typename?: 'Household', id: string, name: string, sumOfAllPayments?: any | null | undefined, owner?: { __typename?: 'User', firstname: string, lastname: string, name: string } | null | undefined } | null | undefined> | null | undefined };

export type UseInviteTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;


export type UseInviteTokenMutation = { __typename?: 'Mutation', useInvite?: { __typename?: 'Invite', id: string } | null | undefined };

export type CreateHouseholdMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type CreateHouseholdMutation = { __typename?: 'Mutation', createHousehold: { __typename?: 'Household', id: string } };
