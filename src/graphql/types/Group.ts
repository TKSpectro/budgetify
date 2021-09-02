import { extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { GroupPayment, User } from '.';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('value');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.list.field('members', {
      type: User,
      description: "A list of all user's which have access to this group.",
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).members();
      },
    });
    t.list.field('payments', {
      type: GroupPayment,
      description: 'A list of all payments which happened in this group.',
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).payments();
      },
    });
  },
});

export const GroupQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('group', {
      type: Group,
      args: { id: nonNull(stringArg()) },
      description: 'Returns a group by searching for the given id.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      resolve(_, args) {
        return prisma.group.findFirst({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
