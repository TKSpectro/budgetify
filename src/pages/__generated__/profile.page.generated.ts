import * as Types from '../../graphql/__generated__/types';

export type ProfileMeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ProfileMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstname: string, lastname: string, name: string, email: string, receiveNotifications: boolean } | null | undefined };

export type UpdateUserMutationVariables = Types.Exact<{
  firstname?: Types.Maybe<Types.Scalars['String']>;
  lastname?: Types.Maybe<Types.Scalars['String']>;
  email?: Types.Maybe<Types.Scalars['String']>;
  receiveNotifications?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name: string, email: string, receiveNotifications: boolean } };

export type DeleteUserMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'User', id: string } };

export type LogoutMutationVariables = Types.Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: string | null | undefined };
