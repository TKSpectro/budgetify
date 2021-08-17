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
      resolve(source) {
        return prisma.category.findUnique({
          where: {
            id: source.categoryId || undefined,
          },
        });
      },
    });
    t.string('userId');
    t.field('user', {
      type: User,
      resolve(source) {
        if (!source.userId) return null;
        return prisma.user.findUnique({
          where: {
            id: source.userId || undefined,
          },
        });
      },
    });
    t.nonNull.string('householdId');
    t.field('household', {
      type: Household,
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
  },
});
