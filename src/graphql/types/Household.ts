import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Invite, Payment, RecurringPayment, User } from '.';

export const Household = objectType({
  name: 'Household',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
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
    t.nonNull.string('ownerId');
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
      args: { skip: intArg(), limit: intArg(), startDate: stringArg(), endDate: stringArg() },
      resolve(source, args) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).payments({
          where: {
            createdAt: {
              gte: args.startDate ? new Date(args.startDate) : undefined,
              lte: args.endDate ? new Date(args.endDate) : undefined,
            },
          },

          orderBy: { createdAt: 'asc' },
          skip: args.skip || undefined,
          take: args.limit || undefined,
        });
      },
    });
    t.list.field('recurringPayments', {
      type: RecurringPayment,
      description: "A list of all recurring payment's which will be booked into this household.",
      args: { id: stringArg(), skip: intArg(), limit: intArg() },
      resolve(source, args) {
        return prisma.household
          .findUnique({ where: { id: source.id || undefined } })
          .RecurringPayment({
            where: {
              id: args.id || undefined,
            },
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
      resolve(_, args, { user }) {
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

export const HouseholdMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateHousehold', {
      type: Household,
      description:
        'Update a already existing household. Need to be logged in and owner of the household.',
      authorize: async (_, args, ctx) => {
        const household = await prisma.household.findFirst({
          where: { id: args.id },
        });
        // Check if the user is the owner of the household.
        const householdOwner = household?.ownerId === ctx.user.id;
        // User must be logged in and own the household
        return !!ctx.user && householdOwner;
      },
      args: {
        id: nonNull(stringArg()),
        ownerId: stringArg(),
      },
      async resolve(_, args) {
        return prisma.household.update({
          where: { id: args.id },
          data: { ownerId: args.ownerId || undefined },
        });
      },
    });

    t.nonNull.field('removeHouseholdMember', {
      type: Household,
      description:
        'Remove a member from the specified household. Need to be logged in and own the household.',
      authorize: async (_, args, ctx) => {
        const household = await prisma.household.findFirst({
          where: { id: args.id },
        });
        // Check if the user is the owner of the household.
        const householdOwner = household?.ownerId === ctx.user.id;
        // User must be logged in and own the household
        return !!ctx.user && householdOwner;
      },
      args: {
        id: nonNull(stringArg()),
        memberId: nonNull(stringArg()),
      },
      async resolve(_, args) {
        return prisma.household.update({
          where: { id: args.id },
          data: { members: { disconnect: { id: args.memberId } } },
        });
      },
    });
  },
});
