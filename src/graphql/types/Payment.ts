import { objectType } from 'nexus';
import prisma from '~/utils/prisma';
import { Category, Household, User } from '.';

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
        return prisma.category.findUnique({
          where: {
            id: root.categoryId || undefined,
          },
        });
      },
    });
    t.string('userId');
    t.field('user', {
      type: User,
      resolve(root) {
        return prisma.user.findUnique({
          where: {
            id: root.userId || undefined,
          },
        });
      },
    });
    t.nonNull.string('householdId');
    t.field('household', {
      type: Household,
      resolve(root) {
        return prisma.household.findUnique({
          where: {
            id: root.householdId || undefined,
          },
        });
      },
    });
  },
});
