import * as Types from '../../../graphql/__generated__/types';

export type ChangePasswordMutationVariables = Types.Exact<{
  password: Types.Scalars['String'];
  passwordRepeat: Types.Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'User', id: string } };
