import { ApolloError } from 'apollo-server-micro';
import {
  addDays,
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  differenceInCalendarMonths,
  differenceInDays,
  differenceInQuarters,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';
import { arg, enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { authIsLoggedIn } from '../authRules';
import { Payment as PaymentType } from '../__generated__/types';

const Interval = enumType({
  name: 'Interval',
  members: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
  description: 'HelperType: The interval of how often the payment should be booked.',
});

export const RecurringPayment = objectType({
  name: 'RecurringPayment',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.string('description');
    t.nonNull.field('interval', { type: Interval });
    t.nonNull.date('startDate');
    t.date('endDate');
    t.date('lastBooking', {
      description: 'The date of when this recurring payment was last booked.',
    });
    t.date('nextBooking', {
      description: 'The date of when this recurring payment should be booked next.',
    });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('category', {
      type: 'Category',
      description: 'The category in which the payment will be booked.',
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
      description: 'The user from whom the payment will be booked.',
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
      description: 'The household in which the payment will be booked.',
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
    t.nonNull.string('householdId');
    t.list.field('payments', {
      type: 'Payment',
      description: "All payment's which where booked by this recurring payment.",
      resolve(source) {
        return prisma.payment.findMany({
          where: {
            recurringPaymentId: source.id || undefined,
          },
        });
      },
    });
  },
});

export const RecurringPaymentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.list.field('bookRecurringPayments', {
      type: RecurringPayment,
      description: `This mutation should be called regularly (at least once a day)
        by a CRON-Job or something of this kind. To book all recurringPayment
        which need to be booked.`,
      args: {
        secretKey: nonNull(stringArg()),
      },
      async resolve(_, args) {
        if (args.secretKey != process.env.BOOKING_KEY) {
          console.log('UNAUTHORIZED BOOKING TRIGGERED');
          return [];
        }

        const bookedPayments: PaymentType[] = [];
        const recPayments = await prisma.recurringPayment.findMany();
        for (const recPayment of recPayments) {
          let diff = 0;
          let nextBooking = new Date();
          switch (recPayment.interval) {
            case 'DAILY':
              {
                diff = differenceInDays(new Date(), recPayment.lastBooking || recPayment.startDate);
                nextBooking = addDays(new Date(), 1);
              }
              break;
            case 'WEEKLY':
              {
                diff = differenceInWeeks(
                  new Date(),
                  recPayment.lastBooking || recPayment.startDate,
                );
                nextBooking = addWeeks(new Date(), 1);
              }
              break;
            case 'MONTHLY':
              {
                diff = differenceInCalendarMonths(
                  new Date(),
                  recPayment.lastBooking || recPayment.startDate,
                );
                nextBooking = addMonths(new Date(), 1);
              }
              break;
            case 'QUARTERLY':
              {
                diff = differenceInQuarters(
                  new Date(),
                  recPayment.lastBooking || recPayment.startDate,
                );
                nextBooking = addQuarters(new Date(), 1);
              }
              break;
            case 'YEARLY':
              {
                diff = differenceInYears(
                  new Date(),
                  recPayment.lastBooking || recPayment.startDate,
                );
                nextBooking = addYears(new Date(), 1);
              }
              break;
          }
          if (diff > 0) {
            bookedPayments.push(
              await prisma.payment.create({
                data: {
                  name: recPayment.name,
                  value: recPayment.value,
                  recurringPaymentId: recPayment.id,
                  categoryId: recPayment.categoryId,
                  householdId: recPayment.householdId,
                  userId: recPayment.userId,
                },
              }),
            );

            await prisma.recurringPayment.update({
              where: { id: recPayment.id },
              data: { lastBooking: new Date(), nextBooking: nextBooking },
            });
          }
        }

        if (bookedPayments.length > 0) {
          console.log(
            'booked recurring payments: ',
            bookedPayments.map((payment) => payment.id),
          );
        }

        return null;
      },
    });

    t.nonNull.field('createRecurringPayment', {
      type: RecurringPayment,
      description: 'Create a new recurring payment. Need to be logged in.',
      authorize: authIsLoggedIn,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
        description: stringArg(),
        interval: nonNull(arg({ type: Interval })),
        startDate: nonNull(arg({ type: 'DateTime' })),
        endDate: arg({ type: 'DateTime' }),
        categoryId: nonNull(stringArg()),
        householdId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        // With this query we can find the household in which the user is wanting
        // to register the recurring payment. Also we automatically check if the user is a member
        // of that household. (Result is always an array, either length 0 or 1)
        const foundHousehold = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .households({ where: { id: args.householdId } });

        // User is not a member of this household -> Not allowed to book payments into it.
        if (foundHousehold.length === 0) {
          throw new ApolloError('errorNotAllowedRecurringPaymentCreation');
        }

        return prisma.recurringPayment.create({
          data: {
            name: args.name,
            value: args.value,
            description: args.description || undefined,
            interval: args.interval,
            startDate: args.startDate,
            endDate: args.endDate,
            nextBooking: args.startDate,
            categoryId: args.categoryId,
            userId: ctx.user.id,
            householdId: foundHousehold[0].id,
          },
        });
      },
    });

    t.nonNull.field('updateRecurringPayment', {
      type: RecurringPayment,
      description: 'Update a new recurring payment. Need to be logged in.',
      authorize: authIsLoggedIn,
      args: {
        id: nonNull(stringArg()),
        name: stringArg(),
        value: arg({ type: 'Money' }),
        description: stringArg(),
        interval: arg({ type: Interval }),
        startDate: arg({ type: 'DateTime' }),
        endDate: arg({ type: 'DateTime' }),
        categoryId: stringArg(),
        householdId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        // With this query we can find the household in which the user is wanting
        // to register the recurring payment. Also we automatically check if the user is a member
        // of that household. (Result is always an array, either length 0 or 1)
        const foundHousehold = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .households({ where: { id: args.householdId } });

        // User is not a member of this household -> Not allowed to book payments into it.
        if (foundHousehold.length === 0) {
          throw new ApolloError('errorNotAllowedRecurringPaymentUpdating');
        }

        return prisma.recurringPayment.update({
          where: {
            id: args.id,
          },
          data: {
            name: args.name || undefined,
            value: args.value || undefined,
            description: args.description || undefined,
            interval: args.interval || undefined,
            startDate: args.startDate || undefined,
            endDate: args.endDate || undefined,
            categoryId: args.categoryId || undefined,
            userId: ctx.user.id,
            householdId: foundHousehold[0].id,
          },
        });
      },
    });
  },
});
