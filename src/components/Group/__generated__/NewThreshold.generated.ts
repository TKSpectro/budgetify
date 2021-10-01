import * as Types from '../../../graphql/__generated__/types';

export type CreateThresholdMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  value: Types.Scalars['Money'];
  type: Types.ThresholdType;
  groupId: Types.Scalars['String'];
}>;


export type CreateThresholdMutation = { __typename?: 'Mutation', createThreshold: { __typename?: 'Threshold', id: string, name: string, value: any, type: Types.ThresholdType } };
