import * as Types from '../../../../graphql/__generated__/types';

export type UpdateHouseholdOwnerMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  ownerId: Types.Scalars['String'];
}>;


export type UpdateHouseholdOwnerMutation = { __typename?: 'Mutation', updateHousehold: { __typename?: 'Household', id: string, ownerId: string } };

export type RemoveHouseholdMemberMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  memberId: Types.Scalars['String'];
}>;


export type RemoveHouseholdMemberMutation = { __typename?: 'Mutation', removeHouseholdMember: { __typename?: 'Household', id: string, members?: Array<{ __typename?: 'User', id: string } | null | undefined> | null | undefined } };
