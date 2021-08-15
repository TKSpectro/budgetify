import {
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
  description: 'The interval of how often the payment should be booked',
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
    t.field('lastBooking', { type: 'DateTime' });
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('categoryId');
    t.field('category', {
      type: Category,
      resolve(root) {
        return prisma.category.findUnique({
          where: {
            id: root.categoryId || undefined,
          },
        });
      },
    });
    t.string('userId');
    t.field('user', {
      type: User,
      resolve(root) {
        if (root.userId) {
          return prisma.user.findUnique({
            where: {
              id: root.userId || undefined,
            },
          });
        }
        return null;
      },
    });
    t.nonNull.string('householdId');
    t.field('household', {
      type: Household,
      resolve(root) {
        return prisma.household.findUnique({
          where: {
            id: root.householdId || undefined,
          },
        });
      },
    });
    t.list.field('payments', {
      type: Payment,
      resolve(root) {
        return prisma.payment.findMany({
          where: {
            recurringPaymentId: root.id || undefined,
          },
        });
      },
    });
  },
});

export const RecurringPaymentsQuery = extendType({
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

export const RecurringPaymentsMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.list.field('bookRecurringPayments', {
      type: RecurringPayment,
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
          switch (recPayment.interval) {
            case 'DAILY':
              {
                diff = differenceInDays(new Date(), recPayment.lastBooking || new Date());
              }
              break;
            case 'WEEKLY':
              {
                diff = differenceInWeeks(new Date(), recPayment.lastBooking || new Date());
              }
              break;
            case 'MONTHLY':
              {
                diff = differenceInCalendarMonths(new Date(), recPayment.lastBooking || new Date());
              }
              break;
            case 'QUARTERLY':
              {
                diff = differenceInQuarters(new Date(), recPayment.lastBooking || new Date());
              }
              break;
            case 'YEARLY':
              {
                diff = differenceInYears(new Date(), recPayment.lastBooking || new Date());
              }
              break;
          }
          if (diff > 0) {
            // TODO: Payment has to be booked
            console.log('booked:', recPayment.id);
            bookedPayments.push(
              await prisma.payment.create({
                data: {
                  name: recPayment.name,
                  value: recPayment.value,
                  recurringPaymentId: recPayment.id,
                  categoryId: recPayment.categoryId,
                  householdId: recPayment.householdId,
                },
              }),
            );

            await prisma.recurringPayment.update({
              where: { id: recPayment.id },
              data: { lastBooking: new Date() },
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
