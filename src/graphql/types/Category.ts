import { extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
  },
});

export const CategoryQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('categories', {
      type: 'Category',
      description: 'All available categories. Filterable by id or name via arguments',
      args: {
        id: stringArg(),
        name: stringArg(),
      },
      resolve(_, args) {
        return prisma.category.findMany({
          where: { id: args.id || undefined, name: args.name || undefined },
        });
      },
    });
  },
});

export const CategoryMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createCategory', {
      type: 'Category',
      description: 'Create a new category. Can just be called by an admin.',
      authorize: (_, __, ctx) => ctx.user.isAdmin,
      args: {
        name: nonNull(stringArg()),
      },
      resolve(_, args) {
        return prisma.category.create({
          data: {
            name: args.name,
          },
        });
      },
    });
    t.nonNull.field('removeCategory', {
      type: 'Category',
      description: 'Remove a new category. Can just be called by an admin.',
      authorize: (_, __, ctx) => ctx.user.isAdmin,
      args: {
        name: nonNull(stringArg()),
      },
      resolve(_, args) {
        return prisma.category.delete({
          where: {
            name: args.name,
          },
        });
      },
    });
  },
});
