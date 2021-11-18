import * as Types from '../../../graphql/__generated__/types';

export type UseInviteTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;


export type UseInviteTokenMutation = { __typename?: 'Mutation', useInvite?: { __typename?: 'Invite', id: string } | null | undefined };

export type CreateHouseholdMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type CreateHouseholdMutation = { __typename?: 'Mutation', createHousehold: { __typename?: 'Household', id: string } };
