import * as Types from '../../../../graphql/__generated__/types';

export type UpdateGroupOwnerMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  ownerId: Types.Scalars['String'];
}>;


export type UpdateGroupOwnerMutation = { __typename?: 'Mutation', addGroupOwner: { __typename?: 'Group', id: string, owners?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined } };

export type RemoveGroupOwnerMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  ownerId: Types.Scalars['String'];
}>;


export type RemoveGroupOwnerMutation = { __typename?: 'Mutation', removeGroupOwner: { __typename?: 'Group', id: string, owners?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined } };

export type RemoveGroupMemberMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  memberId: Types.Scalars['String'];
}>;


export type RemoveGroupMemberMutation = { __typename?: 'Mutation', removeGroupMember: { __typename?: 'Group', id: string, members?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined } };
