import { ApolloError } from 'apollo-server-micro';
import { extendType, objectType } from 'nexus';
import prisma from '~/utils/prisma';

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
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.list.field('payments', {
      type: 'Payment',
      description: "All payment's which where done by the user.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).payments();
      },
    });
    t.list.field('households', {
      type: 'Household',
      description: "The household's in which the user is a member.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).households();
      },
    });
    t.list.field('invites', {
      type: 'Invite',
      description: "The invite's which where send by the user.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).invites();
      },
    });
    t.list.field('ownedHouseholds', {
      type: 'Household',
      description: "The household's in which the user is the current owner",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).ownedHouseholds();
      },
    });
    t.list.field('groups', {
      type: 'Group',
      description: "The group's in which the user is joined.",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).groups();
      },
    });
    t.list.field('ownedGroups', {
      type: 'Group',
      description: "The groups's in which the user is the current owner",
      resolve(source) {
        return prisma.user.findUnique({ where: { id: source.id || undefined } }).ownedGroups();
      },
    });
    t.list.field('groupTransactions', {
      type: 'GroupTransaction',
      description: 'The payments which were booked in groups and where payed by the user.',
      resolve(source) {
        return prisma.user
          .findUnique({ where: { id: source.id || undefined } })
          .groupTransactions();
      },
    });
    t.list.field('groupTransactionsParticipant', {
      type: 'GroupTransaction',
      description:
        'All group payments which the user participated in. e.g. user ate some of the bought stuff.',
      resolve(source) {
        return prisma.user
          .findUnique({ where: { id: source.id || undefined } })
          .groupTransactionsParticipant();
      },
    });
  },
});

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('deleteUser', {
      type: User,
      description: 'Deletes a user by anonymizing his personal data. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, __, ctx) {
        const ownedGroups = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .ownedGroups();

        const ownedHouseholds = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .ownedHouseholds();

        // If the user own any groups or households we can not delete the account.
        // Prisma always returns an array. So we can just check for then length of it,
        // if the length is 0 the user does not own any households or groups
        if (ownedGroups.length > 0 || ownedHouseholds.length > 0) {
          // TODO: return all household and group names he owns
          throw new ApolloError(
            `You are the owner of ${ownedHouseholds.length} households. Please go to each household and give another user the owner role.`,
          );
        }

        return prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            firstname: 'deleted',
            lastname: 'user',
            email: 'deleted.' + new Date().getTime() + '@' + process.env.DOMAIN,
            hashedPassword: '',
            invites: { deleteMany: {} },
            isAdmin: false,
          },
        });
      },
    });
  },
});
