import * as Types from '../../../graphql/__generated__/types';

export type Signup_MutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
  firstname: Types.Scalars['String'];
  lastname: Types.Scalars['String'];
}>;


export type Signup_Mutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthToken', token: string } };
