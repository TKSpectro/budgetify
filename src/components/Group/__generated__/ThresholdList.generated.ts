import * as Types from '../../../graphql/__generated__/types';

export type UpdateThresholdMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  groupId: Types.Scalars['String'];
  name?: Types.Maybe<Types.Scalars['String']>;
  value?: Types.Maybe<Types.Scalars['Money']>;
  type?: Types.Maybe<Types.ThresholdType>;
}>;


export type UpdateThresholdMutation = { __typename?: 'Mutation', updateThreshold: { __typename?: 'Threshold', id: string, name: string, value: any, type: Types.ThresholdType } };

export type RemoveThresholdMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  groupId: Types.Scalars['String'];
}>;


export type RemoveThresholdMutation = { __typename?: 'Mutation', removeThreshold: { __typename?: 'Threshold', id: string } };
