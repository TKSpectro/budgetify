import { ApolloError } from 'apollo-server-micro';
import { extendType, objectType } from 'nexus';
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

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteUser', {
      type: User,
      description: 'Deletes a user and removes all references to it. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, __, ctx) {
        // The only NonNull UserReference is the owner of households, get them from the db
        // and if the user is the owner of some households cancel the deletion.
        // If the user has no owner roles, just delete the account.
        const households = await prisma.household.findMany({
          where: { ownerId: ctx.user.id },
        });

        // Prisma always returns an array. So we can just check for then length of it,
        // if the length is 0 the user does not own any households
        if (households.length > 0) {
          throw new ApolloError(
            `You are the owner of ${households.length} households. Please go to each household and give another user the owner role.`,
          );
        }

        return prisma.user.delete({ where: { id: ctx.user.id } });
      },
    });
  },
});
