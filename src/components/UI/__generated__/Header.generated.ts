import * as Types from '../../../graphql/__generated__/types';

export type Me_QueryVariables = Types.Exact<{ [key: string]: never; }>;


export type Me_Query = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstname: string, lastname: string, email: string } | null | undefined };
