import * as Types from '../../../../graphql/__generated__/types';

export type CreateInviteMutationVariables = Types.Exact<{
  invitedEmail: Types.Scalars['String'];
  householdId: Types.Scalars['String'];
}>;


export type CreateInviteMutation = { __typename?: 'Mutation', createInvite: { __typename?: 'Invite', id: string } };
