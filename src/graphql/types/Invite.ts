import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { Household, User } from '.';

export const Invite = objectType({
  name: 'Invite',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('validUntil', { type: 'DateTime' });
    t.nonNull.boolean('wasUsed');
    t.nonNull.string('invitedEmail');
    t.nonNull.string('link');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('senderId');
    t.field('sender', {
      type: User,
      resolve(root) {
        return prisma.user.findUnique({
          where: {
            id: root.senderId || undefined,
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
