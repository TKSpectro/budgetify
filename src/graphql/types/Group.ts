import { extendType, floatArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { GroupPayment, User } from '.';
import { Participant as ParticipantType } from '../__generated__/types';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.float('value');
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

const Participant = objectType({
  name: 'Participant',
  description: `HelperType: Contains a participant and the value he can take out of the group or has to pay.`,
  definition(t) {
    t.nonNull.string('userId');
    t.nonNull.string('name');
    t.nonNull.float('value');
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
    t.list.field('calculateMemberBalances', {
      type: Participant,
      args: { id: nonNull(stringArg()) },
      description: 'Returns a group by searching for the given id.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, args, ctx) {
        let participants: ParticipantType[] = [];

        const group = await prisma.group.findUnique({
          where: { id: args.id },
          include: {
            members: true,
            payments: {
              include: {
                user: true,
                participants: true,
              },
            },
          },
        });

        // Run through all members of the group and firstly add them to the list
        group?.members.map((member) => {
          participants.push({
            userId: member.id,
            name: member.firstname + ' ' + member.lastname,
            value: 0,
          });
        });

        // Run through all Payment in the group
        group?.payments.map((payment) => {
          // If the payment value is positive e.g. somebody put money into the group, then we add that to their virtual "balance"
          if (payment.value >= 0) {
            const index = participants.findIndex((el) => el.userId === payment.userId);
            participants[index].value += payment.value;
          }

          if (payment.value < 0) {
            // If the payment value is negative e.g. somebody bought food. We go through the participants
            // (which ate something from this bought food) and add their part onto their virtual "balance"
            payment.participants.map((participant) => {
              // Foreach Participant add the value divided by the amount of people for that payment
              const index = participants.findIndex((el) => el.userId === participant.id);
              participants[index].value += payment.value / payment.participants.length;
            });
          }
        });

        return participants;
      },
    });
  },
});

export const GroupMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createGroup', {
      type: Group,
      args: {
        name: nonNull(stringArg()),
        value: floatArg(),
      },
      description: 'Creates a new group with the given arguments and returns it.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      resolve(_, args, ctx) {
        return prisma.group.create({
          data: {
            name: args.name,
            value: args.value || 0.0,
            members: { connect: { id: ctx.user.id } },
          },
        });
      },
    });
  },
});
