import { ApolloError } from 'apollo-server-micro';
import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Category, Household, User } from '.';

export const Payment = objectType({
  name: 'Payment',
  description: 'A payment is a NOT changeable booking of a specific value.',
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
      description: 'The category in which the user placed it. (e.g. food, income)',
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
      description: 'The user from which the payment was booked.',
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
      description: 'The household in which the payment was booked.',
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

export const PaymentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createPayment', {
      type: Payment,
      description: 'Create a new payment. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      args: {
        name: nonNull(stringArg()),
        value: nonNull(intArg()),
        description: stringArg(),
        categoryId: nonNull(stringArg()),
        householdId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        // With this query we can find the household in which the user is wanting
        // to book the payment. Also we automatically check if the user is a member
        // of that household. (Result is always an array, either length 0 or 1)
        const foundHousehold = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .households({ where: { id: args.householdId } });

        // User is not a member of this household -> Not allowed to book payments into it.
        if (foundHousehold.length === 0) {
          throw new ApolloError('You are not allowed to create a payment in this household.');
        }

        return prisma.payment.create({
          data: {
            name: args.name,
            value: args.value,
            description: args.description || undefined,
            categoryId: args.categoryId,
            userId: ctx.user.id,
            householdId: foundHousehold[0].id,
          },
        });
      },
    });
  },
});
