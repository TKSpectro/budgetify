import { makeSchema, objectType, queryType } from 'nexus';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import path from 'path';

const Company = objectType({
  name: 'Company',
  definition(t) {
    t.model.id();
    t.model.symbol();
    t.model.name();
    t.model.description();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.company();
  },
});

const types = { Query, Company };

export const schema = makeSchema({
  types,
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(process.cwd(), 'schema.graphql'),
    typegen: path.join(process.cwd(), 'nexus.ts'),
  },

  // typegenAutoConfig: {
  //   contextType: 'Context.Context',
  //   sources: [
  //     { source: '@prisma/client', alias: 'prisma' },
  //     { source: require.resolve('../utils/context'), alias: 'Context' },
  //   ],
  // },
});
