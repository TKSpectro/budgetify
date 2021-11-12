import * as Types from '../../../../graphql/__generated__/types';

export type GroupManageQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GroupManageQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string } | null | undefined, group?: { __typename?: 'Group', id: string, name: string, value: any, owners?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined, members?: Array<{ __typename?: 'User', id: string, name: string, email: string } | null | undefined> | null | undefined, invites?: Array<{ __typename?: 'Invite', id: string, invitedEmail: string, validUntil: any } | null | undefined> | null | undefined } | null | undefined };
