import { objectType, queryType } from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.string('id');
    t.string('name');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
  },
});
