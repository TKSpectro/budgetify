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
import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Category, Household, Payment, User } from '.';
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
    t.nonNull.float('value');
    t.string('description');
    t.nonNull.field('interval', { type: Interval });
    t.nonNull.field('startDate', { type: 'DateTime' });
    t.field('endDate', { type: 'DateTime' });
    t.field('lastBooking', {
      type: 'DateTime',
      description: 'The date of when this recurring payment was last booked.',
    });
    t.field('nextBooking', {
      type: 'DateTime',
      description: 'The date of when this recurring payment should be booked next.',
    });
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('categoryId');
    t.field('category', {
      type: Category,
      description: 'The category in which the payment will be booked.',
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
      description: 'The user from whom the payment will be booked.',
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
      description: 'The household in which the payment will be booked.',
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
    t.list.field('payments', {
      type: Payment,
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

export const RecurringPaymentQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('recurringPayments', {
      type: RecurringPayment,
      resolve(_, __, { user }) {
        return prisma.recurringPayment.findMany();
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
  },
});