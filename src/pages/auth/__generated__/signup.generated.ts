import * as Types from '../../../graphql/__generated__/types';

export type SignupMutationVariables = Types.Exact<{
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
  firstname: Types.Scalars['String'];
  lastname: Types.Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthToken', token: string } };
