import * as Types from '../../../graphql/__generated__/types';

export type Change_PasswordVariables = Types.Exact<{
  password: Types.Scalars['String'];
  passwordRepeat: Types.Scalars['String'];
}>;


export type Change_Password = { __typename?: 'Mutation', changePassword: { __typename?: 'User', id: string } };
