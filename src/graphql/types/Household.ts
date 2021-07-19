import prisma from '@/utils/prisma';
import { extendType, objectType } from 'nexus';
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
        return prisma.household.findUnique({ where: { id: root.id || undefined } }).members();
      },
    });
    t.list.field('invites', {
      type: Invite,
      resolve(root) {
        return prisma.household.findUnique({ where: { id: root.id || undefined } }).invites();
      },
    });
    t.list.field('payments', {
      type: Payment,
      resolve(root) {
        return prisma.household.findUnique({ where: { id: root.id || undefined } }).payments();
      },
    });
  },
});

export const HouseholdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('households', {
      type: Household,
      resolve() {
        return prisma.household.findMany();
      },
    });
  },
});
