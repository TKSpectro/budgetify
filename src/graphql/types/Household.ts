import { arg, booleanArg, extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import {
  authIsAdmin,
  authIsHouseholdOwner,
  authIsHouseholdOwnerOrMemberIdCurrentUser,
  authIsLoggedIn,
} from '../authRules';
import { Payment } from '../__generated__/types';

export const Household = objectType({
  name: 'Household',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('owner', {
      type: 'User',
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
      type: 'User',
      description: "A list of all user's which have access to this household.",
      resolve(source) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).members();
      },
    });
    t.list.field('invites', {
      type: 'Invite',
      description: "A list of all invite's for this household.",
      resolve(source) {
        return prisma.household.findUnique({ where: { id: source.id || undefined } }).invites();
      },
    });
    t.list.field('payments', {
      type: 'Payment',
      description: "A list of all payment's which where booked into this household.",
      args: {
        skip: intArg(),
        limit: intArg(),
        startDate: arg({ type: 'DateTime' }),
        endDate: arg({ type: 'DateTime' }),
        calcBeforeStartDate: booleanArg(),
      },
      async resolve(source, args) {
        let payments = await prisma.household
          .findUnique({ where: { id: source.id || undefined } })
          .payments({
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

        if (args.calcBeforeStartDate) {
          const beforePayments = await prisma.household
            .findUnique({ where: { id: source.id || undefined } })
            .payments({
              where: {
                createdAt: {
                  lt: args.startDate ? new Date(args.startDate) : undefined,
                },
              },

              orderBy: { createdAt: 'asc' },
            });

          const beforeSum = beforePayments.reduce(
            (sum: number, payment: Payment) => +sum + +payment.value,
            0.0,
          );

          payments.unshift({
            id: '-1',
            name: `Start Value at ${new Date(args.startDate).toDateString()}`,
            value: beforeSum,
            description: '',
            categoryId: payments[0].categoryId,
            createdAt: payments[0].createdAt,
            updatedAt: payments[0].updatedAt,
            householdId: '',
            userId: '',
            recurringPaymentId: '',
          });
        }

        return payments;
      },
    });
    t.field('sumOfAllPayments', {
      type: 'Money',
      description: 'All payment values summed up.',
      async resolve(source) {
        const payments = await prisma.household
          .findUnique({ where: { id: source.id || undefined } })
          .payments();

        return payments.reduce((sum: number, payment: Payment) => +sum + +payment.value, 0.0);
      },
    });
    t.list.field('recurringPayments', {
      type: 'RecurringPayment',
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
      authorize: authIsAdmin,
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
    t.nonNull.field('createHousehold', {
      type: Household,
      description: 'Create a new household. Need to be logged.',
      authorize: authIsLoggedIn,
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        return prisma.household.create({
          data: {
            name: args.name,
            members: { connect: { id: ctx.user.id } },
            owner: { connect: { id: ctx.user.id } },
          },
        });
      },
    });

    t.nonNull.field('updateHousehold', {
      type: Household,
      description:
        'Update a already existing household. Need to be logged in and owner of the household.',
      authorize: authIsHouseholdOwner,
      args: {
        householdId: nonNull(stringArg()),
        ownerId: stringArg(),
      },
      async resolve(_, args) {
        return prisma.household.update({
          where: { id: args.householdId },
          data: { ownerId: args.ownerId || undefined },
        });
      },
    });

    t.nonNull.field('removeHouseholdMember', {
      type: Household,
      description:
        'Remove a member from the specified household. Need to be logged in and own the household OR Request the removal for your own account.',
      authorize: authIsHouseholdOwnerOrMemberIdCurrentUser,
      args: {
        householdId: nonNull(stringArg()),
        memberId: nonNull(stringArg()),
      },
      async resolve(_, args) {
        return prisma.household.update({
          where: { id: args.householdId },
          data: { members: { disconnect: { id: args.memberId } } },
        });
      },
    });
  },
});
