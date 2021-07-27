import { objectType } from 'nexus';
import prisma from '~/utils/prisma';
import { Household, Invite, Payment } from '.';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('firstname');
    t.nonNull.string('lastname');
    t.nonNull.string('email');
    t.nonNull.string('hashedPassword');
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.list.field('payments', {
      type: Payment,
      resolve(root) {
        return prisma.user.findUnique({ where: { id: root.id || undefined } }).payments();
      },
    });
    t.list.field('households', {
      type: Household,
      resolve(root) {
        return prisma.user.findUnique({ where: { id: root.id || undefined } }).households();
      },
    });
    t.list.field('invites', {
      type: Invite,
      resolve(root) {
        return prisma.user.findUnique({ where: { id: root.id || undefined } }).invites();
      },
    });
    t.list.field('ownedHouseholds', {
      type: Household,
      resolve(root) {
        return prisma.user.findUnique({ where: { id: root.id || undefined } }).ownedHouseholds();
      },
    });
  },
});
