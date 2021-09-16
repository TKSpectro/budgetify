import { arg, enumType, extendType, list, nonNull, objectType, stringArg } from 'nexus';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import prisma from '~/utils/prisma';
import { authIsLoggedIn } from '../authRules';
import { Context } from '../context';
import { createNodemailerTransporter } from '../helper';

export const TransactionType = enumType({
  name: 'TransactionType',
  members: ['TOP_UP', 'TAKE_OUT', 'BUY'],
});

export const GroupTransaction = objectType({
  name: 'GroupTransaction',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.field('type', { type: TransactionType });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('group', {
      type: 'Group',
      description: 'The group in which this transaction was booked.',
      resolve(source) {
        return prisma.group.findUnique({
          where: {
            id: source.groupId,
          },
        });
      },
    });
    t.nonNull.string('groupId');
    t.field('user', {
      type: 'User',
      description: 'The user which booked the transaction.',
      resolve(source) {
        return prisma.user.findUnique({
          where: {
            id: source.userId,
          },
        });
      },
    });
    t.nonNull.string('userId');
    t.list.field('participants', {
      type: 'User',
      description: 'All users which ate some of the bought food from this transaction.',
      resolve(source) {
        return prisma.groupTransaction.findUnique({ where: { id: source.id } }).participants();
      },
    });
  },
});

export const GroupTransactionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGroupTransaction', {
      type: GroupTransaction,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
        type: nonNull(arg({ type: TransactionType })),
        groupId: nonNull(stringArg()),
        participantIds: nonNull(list(nonNull(stringArg()))),
      },
      description:
        'Creates a new transaction in the specified group with the given arguments and returns it.',
      authorize: authIsLoggedIn,
      async resolve(_, args, ctx: Context) {
        // Update value of the group with the transaction value
        const group = await prisma.group.update({
          where: { id: args.groupId },
          data: { value: { increment: Number(args.value) } },
          include: { thresholds: true, members: true },
        });

        const transaction = await prisma.groupTransaction.create({
          data: {
            name: args.name,
            value: args.value,
            type: args.type,
            group: { connect: { id: args.groupId } },
            user: { connect: { id: ctx.user.id } },
            participants: {
              // If no participants were send or the type is take out (the user just took out money
              // from the bank) we add the user which created the transaction to the list,
              // else we add the given participants
              connect:
                args.participantIds.length === 0 || args.type === 'TAKE_OUT'
                  ? { id: ctx.user.id }
                  : args.participantIds.map((pid) => {
                      return { id: pid };
                    }),
            },
          },
        });

        if (!!group.thresholds) {
          const transporter = createNodemailerTransporter({});
          if (transporter) {
            const mailOptions: MailOptions = {
              from: `${process.env.DOMAIN} <info@${process.env.DOMAIN}>`,
              to: group.members.map((member) => member.email).join(),
              subject: 'Info from budgetify',
              text: '',
            };

            // ? TODO: Should only owner's get a mail or everybody
            // Check if any hooked threshold needs to trigger
            group.thresholds.forEach(async (threshold) => {
              // TODO: Maybe decide if going over is a good thing or a bad thing or maybe just a warning
              if (threshold.type === 'MAX') {
                if (group.value > threshold.value) {
                  mailOptions.text = `Your group ${group.name} just went over the ${threshold.name} maximum threshold.`;
                  transporter.sendMail(mailOptions);
                }
              } else if (threshold.type === 'MIN') {
                if (group.value < threshold.value) {
                  mailOptions.text = `Your group ${group.name} just went under the ${threshold.name} minimum threshold.`;
                  transporter.sendMail(mailOptions);
                }
              } else if (threshold.type === 'GOAL') {
                if (group.value > threshold.value) {
                  mailOptions.text = `Your group ${group.name} just reached the ${threshold.name} goal.`;
                  transporter.sendMail(mailOptions);
                }
              }
            });

            // Close the connection
            transporter.close();
          }
        }

        return transaction;
      },
    });
  },
});
