import { fieldAuthorizePlugin, makeSchema } from 'nexus';
import path from 'path';
import * as types from './types';

/**
 * Nexus schema which can be used for the apollo-server
 */
export const schema = makeSchema({
  types,
  // Load fieldAuthorize for a easy way to implement custom auth rules which can be reused
  plugins: [fieldAuthorizePlugin()],
  outputs: {
    // The Graphql-SDL file generated from the types created by nexus
    schema: path.join(process.cwd(), 'src', 'graphql', 'schema.graphql'),
    // Create a typescript file containing all types available in the graphql api
    typegen: path.join(process.cwd(), 'src', 'graphql', 'nexus.ts'),
  },
});
