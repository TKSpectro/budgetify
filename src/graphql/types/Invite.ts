import { ApolloError } from 'apollo-server-micro';
import { compareAsc } from 'date-fns';
import addDays from 'date-fns/addDays';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { Household, User } from '.';
import { Context } from '../context';

export const Invite = objectType({
  name: 'Invite',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('validUntil', { type: 'DateTime' });
    t.nonNull.boolean('wasUsed');
    t.nonNull.string('invitedEmail', { description: 'The email of the person which was invited.' });
    t.nonNull.string('token', {
      description: 'The token which can be used from invited person to use the invite.',
    });
    t.nonNull.field('createdAt', { type: 'DateTime' });
    t.nonNull.field('updatedAt', { type: 'DateTime' });
    t.nonNull.string('senderId');
    t.field('sender', {
      type: User,
      description: 'The user which sent the invite. (Referrer)',
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.senderId || undefined,
          },
        });
      },
    });
    t.nonNull.string('householdId');
    t.field('household', {
      type: Household,
      description: 'The household in which the person was invited.',
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
  },
});

export const InviteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createInvite', {
      type: Invite,
      description: 'Create a new invite. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      args: {
        invitedEmail: nonNull(stringArg()),
        householdId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx: Context) {
        // With this query we can find the household in which the user is wanting
        // to book the payment. Also we automatically check if the user is a member
        // of that household. (Result is always an array, either length 0 or 1)
        const foundHousehold = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .households({ where: { id: args.householdId } });

        // User is not a member of this household -> Not allowed to book payments into it.
        if (foundHousehold.length === 0) {
          throw new ApolloError('You are not allowed to create a new invite in this household.');
        }

        return prisma.invite.create({
          data: {
            validUntil: addDays(new Date(), 14),
            wasUsed: false,
            invitedEmail: args.invitedEmail,
            senderId: ctx.user.id,
            householdId: args.householdId,
          },
        });
      },
    });
    t.field('useInvite', {
      type: Invite,
      description:
        'Use a invite. Logged in user gets added to the household in invite. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(_, args, ctx: Context) {
        const invite = await prisma.invite.findUnique({
          where: {
            token: args.token,
          },
        });

        if (!invite) {
          throw new ApolloError('Invite token was not valid.');
        }
        if (invite.wasUsed) {
          throw new ApolloError('Invite was already used.');
        }
        if (compareAsc(invite.validUntil, new Date()) !== 1) {
          throw new ApolloError('Invite is not valid anymore.');
        }
        if (ctx.user.email !== invite.invitedEmail) {
          throw new ApolloError('Invite token was not created for your email address.');
        }

        const user = await prisma.user.update({
          where: { id: ctx.user.id },
          data: { households: { connect: { id: invite.householdId } } },
        });

        if (!user) {
          throw new ApolloError('Invite token could not be used.');
        }

        const updatedInvite = await prisma.invite.update({
          where: { id: invite.id },
          data: { updatedAt: new Date(), wasUsed: true },
        });

        return updatedInvite;
      },
    });

    t.field('deleteInvite', {
      type: 'Boolean',
      description: 'Remove a invite. Need to be logged in.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      args: {
        id: nonNull(stringArg()),
      },
      async resolve(_, args, ctx: Context) {
        try {
          await prisma.invite.delete({
            where: {
              id: args.id,
            },
          });
        } catch (error) {
          throw new ApolloError('Could not delete a invite with this id.');
        }

        return true;
      },
    });
  },
});
