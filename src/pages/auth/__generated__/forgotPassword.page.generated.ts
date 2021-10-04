import * as Types from '../../../graphql/__generated__/types';

export type RequestOtpMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type RequestOtpMutation = { __typename?: 'Mutation', requestPasswordReset: string };
