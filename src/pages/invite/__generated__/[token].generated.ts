import * as Types from '../../../graphql/__generated__/types';

export type Get_TokenVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;


export type Get_Token = { __typename?: 'Query', getInviteByToken?: { __typename?: 'Invite', id: string, invitedEmail: string, token: string, groupId?: string | null | undefined, householdId?: string | null | undefined } | null | undefined };

export type UseTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;


export type UseTokenMutation = { __typename?: 'Mutation', useInvite?: { __typename?: 'Invite', id: string } | null | undefined };
