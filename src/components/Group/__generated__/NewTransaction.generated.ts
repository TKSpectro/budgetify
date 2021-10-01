import * as Types from '../../../graphql/__generated__/types';

export type CreateGroupTransactionMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  value: Types.Scalars['Money'];
  type: Types.TransactionType;
  groupId: Types.Scalars['String'];
  participantIds: Array<Types.Scalars['String']> | Types.Scalars['String'];
}>;


export type CreateGroupTransactionMutation = { __typename?: 'Mutation', createGroupTransaction?: { __typename?: 'GroupTransaction', id: string } | null | undefined };
