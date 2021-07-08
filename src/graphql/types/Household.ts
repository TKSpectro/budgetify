import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { Invite, Payment, User } from '.';

export const Household = objectType({
  name: 'Household',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('ownerId');
    t.field('owner', {
      type: User,
      resolve(root) {
        return prisma.user.findUnique({
          where: {
            id: root.ownerId || undefined,
          },
        });
      },
    });
    t.list.field('members', {
      type: User,
      resolve(root) {
        return prisma.user.findMany({
          where: {
            households: {
              some: {
                id: { equals: root.id || undefined },
              },
            },
          },
        });
      },
    });
    t.list.field('invites', {
      type: Invite,
      resolve(root) {
        return prisma.invite.findMany({
          where: {
            householdId: root.id || undefined,
          },
        });
      },
    });
    t.list.field('payments', {
      type: Payment,
      resolve(root) {
        return prisma.payment.findMany({
          where: {
            userId: root.id || undefined,
          },
        });
      },
    });
  },
});
