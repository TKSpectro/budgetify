import * as Types from '../../../../graphql/__generated__/types';

export type Household_Manage_QueryVariables = Types.Exact<{
  householdId: Types.Scalars['String'];
}>;


export type Household_Manage_Query = { __typename?: 'Query', household?: { __typename?: 'Household', id: string, name: string, owner?: { __typename?: 'User', id: string, firstname: string, lastname: string } | null | undefined, members?: Array<{ __typename?: 'User', id: string, name: string, email: string } | null | undefined> | null | undefined, invites?: Array<{ __typename?: 'Invite', id: string, validUntil: any, wasUsed: boolean, invitedEmail: string, token: string, createdAt: any, updatedAt: any, sender?: { __typename?: 'User', id: string, name: string } | null | undefined } | null | undefined> | null | undefined } | null | undefined };
