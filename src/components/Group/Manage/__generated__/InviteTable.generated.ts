import * as Types from '../../../../graphql/__generated__/types';

export type DeleteGroupInviteMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteGroupInviteMutation = { __typename?: 'Mutation', deleteInvite?: boolean | null | undefined };
