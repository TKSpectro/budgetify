import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { Category } from '.';

export const Payment = objectType({
  name: 'Payment',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.float('value');
    t.string('description');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('categoryId');
    t.field('category', {
      type: Category,
      resolve(root) {
        return prisma.category.findFirst({
          where: {
            id: root.categoryId,
          },
        });
      },
    });
  },
});
