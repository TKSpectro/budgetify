import * as Types from '../../../graphql/__generated__/types';

export type Request_OtpVariables = Types.Exact<{
  email: Types.Scalars['String'];
}>;


export type Request_Otp = { __typename?: 'Mutation', requestPasswordReset: string };
