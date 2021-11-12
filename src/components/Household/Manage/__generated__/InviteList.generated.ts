import * as Types from '../../../../graphql/__generated__/types';

export type DeleteInviteMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteInviteMutation = { __typename?: 'Mutation', deleteInvite?: boolean | null | undefined };
