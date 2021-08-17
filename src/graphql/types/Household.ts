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
      description: "The user which has management right's over the household.",
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.ownerId || undefined,
          },
        });
      },
    });
    t.list.field('members', {
      type: User,
      description: "A list of all user's which have access to this household.",
      resolve(source) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).members();
      },
    });
    t.list.field('invites', {
      type: Invite,
      description: "A list of all invite's for this household.",
      resolve(source) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).invites();
      },
    });
    t.list.field('payments', {
      type: Payment,
      description: "A list of all payment's which where booked into this household.",
      args: { skip: intArg(), limit: intArg() },
      resolve(source, args) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).payments({
          orderBy: { createdAt: 'asc' },
          skip: args.skip || undefined,
          take: args.limit || undefined,
        });
      },
    });
    t.list.field('recurringPayments', {
      type: RecurringPayment,
      description: "A list of all recurring payment's which will be booked into this household.",
      args: { skip: intArg(), limit: intArg() },
      resolve(source, args) {
        return prisma.household
          .findUnique({ where: { id: source.id || undefined } })
          .RecurringPayment({
            orderBy: { nextBooking: 'asc' },
            skip: args.skip || undefined,
            take: args.limit || undefined,
          });
      },
    });
  },
});

export const HouseholdQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allHouseholds', {
      type: Household,
      description: `Returns all households available in the database. 
      Can only be queried by admin accounts.`,
      authorize: (_, __, ctx) => ctx.user.isAdmin,
      resolve() {
        return prisma.household.findMany();
      },
    });
    t.list.field('households', {
      type: Household,
      resolve(_, __, { user }) {
        return prisma.user.findUnique({ where: { id: user.id || undefined } }).households();
      },
    });
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
