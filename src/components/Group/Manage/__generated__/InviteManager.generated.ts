import * as Types from '../../../../graphql/__generated__/types';

export type CreateGroupInviteMutationVariables = Types.Exact<{
  invitedEmail: Types.Scalars['String'];
  groupId: Types.Scalars['String'];
}>;


export type CreateGroupInviteMutation = { __typename?: 'Mutation', createGroupInvite: { __typename?: 'Invite', id: string } };

export type DeleteGroupInviteMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteGroupInviteMutation = { __typename?: 'Mutation', deleteInvite?: boolean | null | undefined };
