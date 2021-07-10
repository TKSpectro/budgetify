import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { Household, Invite, Payment } from '.';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('firstname');
    t.nonNull.string('lastname');
    t.nonNull.string('email');
    t.nonNull.string('hashedPassword');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
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
    t.list.field('households', {
      type: Household,
      resolve(root) {
        return prisma.household.findMany({
          where: {
            members: { some: { id: { equals: root.id } || undefined } },
          },
        });
      },
    });
    t.list.field('invites', {
      type: Invite,
      resolve(root) {
        return prisma.invite.findMany({
          where: {
            senderId: root.id || undefined,
          },
        });
      },
    });
    t.list.field('ownedHouseholds', {
      type: Household,
      resolve(root) {
        return prisma.household.findMany({
          where: {
            ownerId: root.id || undefined,
          },
        });
      },
    });
  },
});