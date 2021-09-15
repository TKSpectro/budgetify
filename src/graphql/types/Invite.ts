import { ApolloError } from 'apollo-server-micro';
import { compareAsc } from 'date-fns';
import addDays from 'date-fns/addDays';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import prisma from '~/utils/prisma';
import { authIsLoggedIn } from '../authRules';
import { Context } from '../context';
import { createNodemailerTransporter } from '../helper';

export const Invite = objectType({
  name: 'Invite',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.date('validUntil');
    t.nonNull.boolean('wasUsed');
    t.nonNull.string('invitedEmail', { description: 'The email of the person which was invited.' });
    t.nonNull.string('token', {
      description: 'The token which can be used from invited person to use the invite.',
    });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('sender', {
      type: 'User',
      description: 'The user which sent the invite. (Referrer)',
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.senderId || undefined,
          },
        });
      },
    });
    t.nonNull.string('senderId');
    t.field('household', {
      type: 'Household',
      description: 'The household in which the person was invited.',
      resolve(source) {
        return prisma.household.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
    t.string('householdId');
    t.field('group', {
      type: 'Group',
      description: 'The group in which the person was invited.',
      resolve(source) {
        return prisma.group.findUnique({
          where: {
            id: source.householdId || undefined,
          },
        });
      },
    });
    t.string('groupId');
  },
});

export const InviteMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // TODO: Maybe combine createHouseholdInvite and createGroupInvite as there not many differences
    t.nonNull.field('createInvite', {
      type: Invite,
      description: 'Create a new invite. Need to be logged in.',
      authorize: authIsLoggedIn,
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

        const invite = await prisma.invite.create({
          data: {
            validUntil: addDays(new Date(), 14),
            wasUsed: false,
            invitedEmail: args.invitedEmail,
            senderId: ctx.user.id,
            householdId: args.householdId,
          },
        });

        // Send an email out to the invited person with the generated token
        const transporter = createNodemailerTransporter({ enableLogger: false });
        if (transporter) {
          const mailOptions: MailOptions = {
            from: `${process.env.DOMAIN} <no-reply@${process.env.DOMAIN}>`,
            to: invite.invitedEmail,
            subject: `Budgetify | Invite to household - ${foundHousehold[0].name}`,
            text: `invite-token: ${invite.token}`,
          };

          transporter.sendMail(mailOptions);

          // Close the connection
          transporter.close();
        }

        return invite;
      },
    });
    t.field('useInvite', {
      type: Invite,
      description:
        'Use a invite. Logged in user gets added to the household in invite. Need to be logged in.',
      authorize: authIsLoggedIn,
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
          data: { households: { connect: { id: invite.householdId || undefined } } },
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
      authorize: authIsLoggedIn,
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

export const InviteGroupMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createGroupInvite', {
      type: Invite,
      description: 'Create a new invite. Need to be logged in.',
      authorize: authIsLoggedIn,
      args: {
        invitedEmail: nonNull(stringArg()),
        groupId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx: Context) {
        const foundGroup = await prisma.user
          .findUnique({ where: { id: ctx.user.id } })
          .groups({ where: { id: args.groupId } });

        // User is not a member of this group.
        if (foundGroup.length === 0) {
          throw new ApolloError('You are not allowed to create a new invite in this group.');
        }

        const invite = await prisma.invite.create({
          data: {
            validUntil: addDays(new Date(), 14),
            wasUsed: false,
            invitedEmail: args.invitedEmail,
            senderId: ctx.user.id,
            groupId: args.groupId,
          },
        });

        // Send an email out to the invited person with the generated token
        const transporter = createNodemailerTransporter({ enableLogger: false });
        if (transporter) {
          const mailOptions: MailOptions = {
            from: `${process.env.DOMAIN} <no-reply@${process.env.DOMAIN}>`,
            to: invite.invitedEmail,
            subject: `Budgetify | Invite to group - ${foundGroup[0].name}`,
            text: `invite-token: ${invite.token}`,
          };

          transporter.sendMail(mailOptions);

          // Close the connection
          transporter.close();
        }

        return invite;
      },
    });
    t.field('useGroupInvite', {
      type: Invite,
      description:
        'Use a invite. Logged in user gets added to the group specified in the invite. Need to be logged in.',
      authorize: authIsLoggedIn,
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
          data: { groups: { connect: { id: invite.groupId || undefined } } },
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
  },
});
