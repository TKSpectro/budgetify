import { extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Payment } from '.';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.list.field('payments', {
      type: Payment,
      resolve(root) {
        return prisma.category.findUnique({ where: { id: root.id || undefined } }).payments();
      },
    });
  },
});

export const CategoryQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('categories', {
      type: 'Category',
      resolve() {
        return prisma.category.findMany();
      },
    });
    t.field('category', {
      type: 'Category',
      args: {
        id: stringArg(),
        name: stringArg(),
      },
      resolve(_, { id, name }) {
        return prisma.category.findFirst({
          where: {
            id: id || undefined,
            name: name || undefined,
          },
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
