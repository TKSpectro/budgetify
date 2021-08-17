import { extendType, intArg, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Invite, Payment, RecurringPayment, User } from '.';

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
      args: { skip: intArg(), limit: intArg() },
      resolve(root, args) {
        return prisma.household.findUnique({ where: { id: root.id || undefined } }).payments({
          orderBy: { createdAt: 'asc' },
          skip: args.skip || undefined,
          take: args.limit || undefined,
        });
      },
    });
    t.list.field('recurringPayments', {
      type: RecurringPayment,
      args: { skip: intArg(), limit: intArg() },
      resolve(root, args) {
        return prisma.household
          .findUnique({ where: { id: root.id || undefined } })
          .RecurringPayment({
            orderBy: { nextBooking: 'asc' },
            skip: args.skip || undefined,
            take: args.limit || undefined,
          });
      },
    });
  },
});

export const HouseholdsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('households', {
      type: Household,
      resolve(_, __, { user }) {
        return prisma.user.findUnique({ where: { id: user.id || undefined } }).households();
      },
    });
  },
});

export const HouseholdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('household', {
      type: Household,
      args: {
        id: stringArg(),
      },
      resolve(_, { id }, { user }) {
        return prisma.household.findFirst({
          where: { id: id || undefined, members: { some: { id: user.id } } },
        });
      },
    });
  },
});
