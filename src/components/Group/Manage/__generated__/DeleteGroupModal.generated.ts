import * as Types from '../../../../graphql/__generated__/types';

export type DeleteGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename?: 'Group', id: string } };
