import { extendType, floatArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Group, User } from '.';

export const GroupPayment = objectType({
  name: 'GroupPayment',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.float('value');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('groupId');
    t.field('group', {
      type: Group,
      description: 'The group in which this payment was booked.',
      resolve(source) {
        return prisma.group.findUnique({
          where: {
            id: source.groupId || undefined,
          },
        });
      },
    });
    t.nonNull.string('userId');
    t.field('user', {
      type: User,
      description: 'The user which booked the payment.',
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.userId || undefined,
          },
        });
      },
    });
    t.list.field('participants', {
      type: User,
      description: 'All users which ate some of the bought feed from this payment.',
      resolve(source) {
        return prisma.user.findMany({
          where: {
            groupPaymentsParticipant: { some: { id: source.id } },
          },
        });
      },
    });
  },
});

export const GroupPaymentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGroupPayment', {
      type: GroupPayment,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(floatArg()),
        groupId: nonNull(stringArg()),
      },
      description:
        'Creates a new payment in the specified group with the given arguments and returns it.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, args, ctx) {
        // Update value of the group
        await prisma.group.update({
          where: { id: args.groupId },
          data: { value: { increment: args.value } },
        });

        return prisma.groupPayment.create({
          data: {
            name: args.name,
            value: args.value,
            groupId: args.groupId,
            userId: ctx.user.id,
          },
        });
      },
    });
  },
});
