import * as Types from '../../graphql/__generated__/types';

export type HomeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type HomeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, firstname: string, lastname: string, name: string, email: string, receiveNotifications: boolean, isAdmin: boolean, households?: Array<{ __typename?: 'Household', id: string, name: string, sumOfAllPayments?: any | null | undefined, owner?: { __typename?: 'User', name: string } | null | undefined } | null | undefined> | null | undefined, groups?: Array<{ __typename?: 'Group', id: string, name: string, value: any, transactionCount?: number | null | undefined } | null | undefined> | null | undefined } | null | undefined };
