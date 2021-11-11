import * as Types from '../../graphql/__generated__/types';

export type MeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string } | null | undefined };
