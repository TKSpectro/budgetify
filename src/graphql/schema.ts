import { makeSchema, queryType } from '@nexus/schema';

const Query = queryType({
  definition(t) {
    t.string('name', { resolve: () => 'John Doe' });
  },
});

const types = { Query };

export const schema = makeSchema({ types });
