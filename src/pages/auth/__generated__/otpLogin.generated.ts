import * as Types from '../../../graphql/__generated__/types';

export type Otp_Login_MutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;


export type Otp_Login_Mutation = { __typename?: 'Mutation', login: { __typename?: 'AuthToken', token: string } };
