import { ApolloError } from 'apollo-server-micro';
import { compareAsc } from 'date-fns';
import addDays from 'date-fns/addDays';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { getBaseUrl } from '~/utils/helper';
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

export const InviteQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getInviteByToken', {
      type: Invite,
      description: 'Get a single invite with the given token. Need to be logged in.',
      authorize: authIsLoggedIn,
      args: {
        token: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const invite = await prisma.invite.findFirst({ where: { token: args.token } });

        if (!invite) {
          throw new ApolloError('errorNoInviteFound');
        }

        return invite;
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
          throw new ApolloError('errorCreateInviteNotAllowedHousehold');
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
        const transporter = createNodemailerTransporter({});
        const inviteUrl = getBaseUrl() + '/invite/' + invite.token;
        if (transporter) {
          const mailOptions: MailOptions = {
            from: `${process.env.DOMAIN} <no-reply@${process.env.DOMAIN}>`,
            to: invite.invitedEmail,
            subject: `Budgetify | Invite to household - ${foundHousehold[0].name}`,
            html: `
            <h3>You need to be logged in to use this invite.</h3>
            <a target="_blank" href="${inviteUrl}">Use Token</a>`,
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
        'Use a invite. Logged in user gets added to the household or group specified in the invite. Need to be logged in.',
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
          throw new ApolloError('errorInviteNotValid');
        }
        if (invite.wasUsed) {
          throw new ApolloError('errorInviteAlreadyUsed');
        }
        if (compareAsc(invite.validUntil, new Date()) !== 1) {
          throw new ApolloError('errorInviteNotValidAnymore');
        }
        if (ctx.user.email !== invite.invitedEmail) {
          throw new ApolloError('errorInviteNotForEmail');
        }

        if (!invite.groupId && !invite.householdId) {
          throw new ApolloError('errorInviteNotValid');
        }

        // Depending on which id is set we connect the user to the corresponding group or household
        const user = await prisma.user.update({
          where: { id: ctx.user.id },
          data: invite.householdId
            ? {
                households: { connect: { id: invite.householdId || undefined } },
              }
            : invite.groupId
            ? {
                groups: { connect: { id: invite.groupId || undefined } },
              }
            : '',
        });

        if (!user) {
          throw new ApolloError('errorInviteCouldNotBeUsed');
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
          throw new ApolloError('errorInviteCouldNotBeDeleted');
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
          throw new ApolloError('errorCreateInviteNotAllowedGroup');
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
        const transporter = createNodemailerTransporter({});
        const inviteUrl = getBaseUrl() + '/invite/' + invite.token;
        if (transporter) {
          const mailOptions: MailOptions = {
            from: `${process.env.DOMAIN} <no-reply@${process.env.DOMAIN}>`,
            to: invite.invitedEmail,
            subject: `Budgetify | Invite to group - ${foundGroup[0].name}`,
            html: `
            <h3>You need to be logged in to use this invite.</h3>
            <a target="_blank" href="${inviteUrl}">Use Token</a>`,
            text: `invite-token: ${invite.token}`,
          };

          transporter.sendMail(mailOptions);

          // Close the connection
          transporter.close();
        }

        return invite;
      },
    });
  },
});
