import * as Types from '../../../../graphql/__generated__/types';

export type Group_QueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
  skip?: Types.Maybe<Types.Scalars['Int']>;
  limit?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type Group_Query = { __typename?: 'Query', me?: { __typename?: 'User', id: string } | null | undefined, group?: { __typename?: 'Group', id: string, name: string, value: any, transactionCount?: number | null | undefined, transactions?: Array<{ __typename?: 'GroupTransaction', id: string, name: string, value: any, participants?: Array<{ __typename?: 'User', name: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined, owners?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined, members?: Array<{ __typename?: 'User', id: string, name: string } | null | undefined> | null | undefined, thresholds?: Array<{ __typename?: 'Threshold', id: string, name: string, type: Types.ThresholdType, value: any } | null | undefined> | null | undefined } | null | undefined, calculateMemberBalances?: Array<{ __typename?: 'Participant', name: string, userId: string, value: any } | null | undefined> | null | undefined };
