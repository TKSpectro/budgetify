import { objectType } from 'nexus';
import prisma from '~/utils/prisma';
import { Household, Invite, Payment } from '.';

export const User = objectType({
  name: 'User',
  description: 'A user is an account which can join households and create payments',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('firstname');
    t.nonNull.string('lastname');
    t.nonNull.string('name', {
      resolve(source) {
        return source.firstname + ' ' + source.lastname;
      },
    });
    t.nonNull.string('email');
    t.nonNull.string('hashedPassword', { description: "The user's safely encrypted password" });
    t.nonNull.boolean('isAdmin', {
      description:
        "The user's role. This could be extended to a complete role system in the future",
    });
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.list.field('payments', {
      type: Payment,
      description: "All payment's which where done by the user.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).payments();
      },
    });
    t.list.field('households', {
      type: Household,
      description: "The household's in which the user is a member.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).households();
      },
    });
    t.list.field('invites', {
      type: Invite,
      description: "The invite's which where send by the user.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).invites();
      },
    });
    t.list.field('ownedHouseholds', {
      type: Household,
      description: "The household's in which the user is the current owner",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).ownedHouseholds();
      },
    });
  },
});
