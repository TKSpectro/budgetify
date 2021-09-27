import { fieldAuthorizePlugin, makeSchema } from 'nexus';
import path from 'path';
import * as types from './types';

export const schema = makeSchema({
  types,
  // Load fieldAuthorize for a easy way to implement custom auth rules which can be reused
  plugins: [fieldAuthorizePlugin()],
  outputs: {
    schema: path.join(process.cwd(), 'src', 'graphql', 'schema.graphql'),
    typegen: path.join(process.cwd(), 'src', 'graphql', 'nexus.ts'),
  },
});
