import { makeSchema } from 'nexus';
import * as types from './resolvers';
import path from 'path';

export const schema = makeSchema({
  types,
  outputs: {
    schema: path.join(process.cwd(), 'src', 'graphql', 'schema.graphql'),
    typegen: path.join(process.cwd(), 'src', 'graphql', 'nexus.ts'),
  },
});
