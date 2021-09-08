import { ApolloError } from 'apollo-server-errors';
import { arg, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { GroupTransaction, User } from '.';
import { Participant as ParticipantType } from '../__generated__/types';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.list.field('members', {
      type: User,
      description: "A list of all user's which have access to this group.",
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).members();
      },
    });
    t.list.field('transactions', {
      type: GroupTransaction,
      description: 'A list of all transactions which happened in this group.',
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).transactions();
      },
    });
    t.list.field('invites', {
      type: 'Invite',
      description: 'A list of all invites to this group.',
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).invites();
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
    t.nonNull.money('value');
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
      description: 'Returns the virtual balances for all members in the given group.',
      authorize: (_, __, ctx) => (ctx.user ? true : false),
      async resolve(_, args, ctx) {
        // * The algorithm to calculate the virtual balances is relatively complex, as we
        // * need to account for the division which ends in a rest different than 0.

        const group = await prisma.group.findUnique({
          where: { id: args.id },
          include: {
            members: true,
            transactions: {
              include: {
                user: true,
                participants: true,
              },
            },
          },
        });
        if (!group) throw new ApolloError('Group not found.');

        // Run through all members of the group and firstly add them to the list
        // So we can easily increase or decrease their personal virtual balance
        let resultParticipants: ParticipantType[] = group?.members.map((member) => {
          return {
            userId: member.id,
            name: member.firstname + ' ' + member.lastname,
            value: 0,
          };
        });

        // The moneypools are used to get a list of all different variants of transactions
        let moneypools: any = {};
        group.transactions.forEach((transaction) => {
          // Take the userIds of all the participants in the current transaction
          // so we cann build our hashmap by concatanaiting the sorted ids.
          let participants = transaction.participants.map((participant) => participant.id);
          // Need to sort the ids so we always get the same order if the same participants are there
          participants.sort();

          // TODO: Could use SHA-1 for better performance for string compares
          // ! Hashes can be insanely long as we conacatinate the UUIDs of all the participants
          let hash = '';
          for (let i = 0; i < participants.length; i++) {
            hash += participants[i];
            if (i < participants.length - 1) hash += ',';
          }

          // Write the value of the transaction into our hashmap of moneypools
          // Add a new entry if it doesnt exist
          if (!moneypools[hash]) {
            moneypools[hash] = transaction.value;
          } else {
            moneypools[hash] += transaction.value;
          }
        });

        // Now we have a hashmap of all transactions which we can use to calculate
        // the virtual balances of the members
        for (let hash in moneypools) {
          // Revert the concatination of the ids by splitting them up again
          const ids = hash.split(',');
          // Calculate the rest for this transaction group, as we need that for the
          // value splitting between the participants
          const rest = moneypools[hash] % ids.length;

          let nearestWholeNumber;
          // Run through all the participants in this pool/transaction and calculate based
          // on the value what to add to their virtual balance
          ids.forEach((id) => {
            // Find in which slot the current id sits in the final array of participants.
            const index = resultParticipants.findIndex((el) => el.userId === id);

            // If the value is positive we can just add the value onto the virtual balance,
            // because this is basically a balance top up, which doesnt get split
            // between participants
            if (moneypools[hash] >= 0) resultParticipants[index].value += moneypools[hash];

            if (moneypools[hash] < 0) {
              if (rest === 0 || rest === -0) {
                // If the rest is 0 we can just divide the transaction value by the amount of
                // participants, as there will be a whole number for everbody to add
                resultParticipants[index].value += moneypools[hash] / ids.length;
              } else {
                // If the rest is unequal to 0 we calculate the nearst whole number which we can
                // then add to the participant
                nearestWholeNumber = Math.round(moneypools[hash] / ids.length);
                resultParticipants[index].value += nearestWholeNumber;
              }
            }
          });

          // If the transaction value cant be split between the participant directly
          // We now look for the "richest" participant and then add the missing part
          // of the division onto his account.
          if (rest !== 0 && rest !== -0) {
            // Find the richest person
            let currentlyRichestParticipant = resultParticipants[0];
            resultParticipants.forEach((participant) => {
              if (participant.value > currentlyRichestParticipant.value) {
                currentlyRichestParticipant = participant;
              }
            });

            // Add the rest value to the before found richest person in this participant group
            const index = resultParticipants.findIndex(
              (el) => el.userId === currentlyRichestParticipant.userId,
            );
            resultParticipants[index].value += rest;
          }
        }

        return resultParticipants;
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
        value: arg({ type: 'Money' }),
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
