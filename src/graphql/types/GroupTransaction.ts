import { arg, extendType, list, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Group, User } from '.';
import { Context } from '../context';

export const GroupTransaction = objectType({
  name: 'GroupTransaction',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.field('group', {
      type: Group,
      description: 'The group in which this transaction was booked.',
      resolve(source) {
        return prisma.group.findUnique({
          where: {
            id: source.groupId || undefined,
          },
        });
      },
    });
    t.nonNull.string('groupId');
    t.field('user', {
      type: User,
      description: 'The user which booked the transaction.',
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.userId || undefined,
          },
        });
      },
    });
    t.nonNull.string('userId');
    t.list.field('participants', {
      type: User,
      description: 'All users which ate some of the bought food from this transaction.',
      resolve(source) {
        return prisma.user.findMany({
          where: {
            groupTransactionsParticipant: { some: { id: source.id } },
          },
        });
      },
    });
  },
});

export const GroupTransactionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGroupTransaction', {
      type: GroupTransaction,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
        groupId: nonNull(stringArg()),
        participantIds: nonNull(list(nonNull(stringArg()))),
      },
      description:
        'Creates a new transaction in the specified group with the given arguments and returns it.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, args, ctx: Context) {
        // Update value of the group
        await prisma.group.update({
          where: { id: args.groupId },
          data: { value: { increment: args.value } },
        });

        const transaction = await prisma.groupTransaction.create({
          data: {
            name: args.name,
            value: args.value,
            groupId: args.groupId,
            userId: ctx.user.id,
          },
        });

        // TODO: Clean up
        if ((args.participantIds.length = 0)) {
          return prisma.groupTransaction.update({
            where: { id: transaction.id },
            data: {
              participants: {
                connect: { id: ctx.user.id },
              },
            },
          });
        } else {
          return prisma.groupTransaction.update({
            where: { id: transaction.id },
            data: {
              participants: {
                connect: args.participantIds.map((pid) => {
                  return { id: pid };
                }),
              },
            },
          });
        }
      },
    });
  },
});
