import { objectType } from 'nexus';
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
  },
});
