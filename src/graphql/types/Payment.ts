import { ApolloError } from 'apollo-server-micro';
import { arg, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { authIsLoggedIn } from '../authRules';

export const Payment = objectType({
  name: 'Payment',
  description: 'A payment is a NOT changeable booking of a specific value.',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.string('description');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('category', {
      type: 'Category',
      description: 'The category in which the user placed it. (e.g. food, income)',
      resolve(source) {
        return prisma.category.findUnique({
          where: {
            id: source.categoryId || undefined,
          },
        });
      },
    });
    t.nonNull.string('categoryId');
    t.field('user', {
      type: 'User',
      description: 'The user from which the payment was booked.',
      resolve(source) {
        if (!source.userId) return null;
        return prisma.user.findUnique({
          where: {
            id: source.userId,
          },
        });
      },
    });
    t.nonNull.string('userId');
    t.field('household', {
      type: 'Household',
      description: 'The household in which the payment was booked.',
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
    t.nonNull.string('householdId');
  },
});

export const PaymentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createPayment', {
      type: Payment,
      description: 'Create a new payment. Need to be logged in.',
      authorize: authIsLoggedIn,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
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
          throw new ApolloError('errorNotAllowedPaymentCreation');
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
