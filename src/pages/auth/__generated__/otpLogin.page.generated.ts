import * as Types from '../../../graphql/__generated__/types';

export type OtpLoginMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type OtpLoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthToken', token: string } };
