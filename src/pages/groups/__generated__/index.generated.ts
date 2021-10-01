import * as Types from '../../../graphql/__generated__/types';

export type Groups_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Groups_Query = { __typename?: 'Query', me?: { __typename?: 'User', id: string, groups?: Array<{ __typename?: 'Group', id: string, name: string, value: any, owners?: Array<{ __typename?: 'User', id: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type UseInviteTokenMutationVariables = Types.Exact<{
  token: Types.Scalars['String'];
}>;


export type UseInviteTokenMutation = { __typename?: 'Mutation', useInvite?: { __typename?: 'Invite', id: string } | null | undefined };

export type CreateGroupMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup?: { __typename?: 'Group', id: string, name: string, value: any, members?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined } | null | undefined };
