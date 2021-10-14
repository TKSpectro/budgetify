import { ApolloError } from 'apollo-server-errors';
import { arg, extendType, intArg, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import {
  authIsGroupMember,
  authIsGroupOwner,
  authIsGroupOwnerOrMemberIdCurrentUser,
  authIsLoggedIn,
} from '../authRules';
import { Participant as ParticipantType } from '../__generated__/types';

export const Group = objectType({
  name: 'Group',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.list.field('owners', {
      type: 'User',
      description: "The users which have management right's over the group.",
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).owners();
      },
    });
    t.list.field('members', {
      type: 'User',
      description: "A list of all user's which have access to this group.",
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).members();
      },
    });
    t.list.field('transactions', {
      type: 'GroupTransaction',
      description: 'A list of all transactions which happened in this group.',
      args: {
        skip: intArg(),
        limit: intArg(),
      },
      resolve(source, args) {
        return prisma.groupTransaction.findMany({
          where: { groupId: source.id },
          orderBy: { createdAt: 'desc' },
          skip: args.skip || undefined,
          take: args.limit || undefined,
        });
      },
    });
    t.field('transactionCount', {
      type: 'Int',
      description: 'The count of all transactions in this group.',
      async resolve(source) {
        const transactions = await prisma.group
          .findUnique({ where: { id: source.id || undefined } })
          .transactions();
        return transactions.length;
      },
    });
    t.list.field('invites', {
      type: 'Invite',
      description: 'A list of all invites to this group.',
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).invites();
      },
    });
    t.list.field('thresholds', {
      type: 'Threshold',
      description: 'A list of all thresholds hooked to this group.',
      resolve(source) {
        return prisma.group.findUnique({ where: { id: source.id || undefined } }).thresholds();
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
      args: { groupId: nonNull(stringArg()) },
      description: 'Returns a group by searching for the given id.',
      authorize: authIsGroupMember,
      resolve(_, args) {
        return prisma.group.findFirst({
          where: {
            id: args.groupId,
          },
        });
      },
    });

    t.list.field('calculateMemberBalances', {
      type: Participant,
      args: { id: nonNull(stringArg()) },
      description: 'Returns the virtual balances for all members in the given group.',
      authorize: authIsLoggedIn,
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
        if (!group) throw new ApolloError('510');

        // Run through all participants in all transactions and add the participant
        // to the result participant. Can not just use members as there could be
        // transaction-participants which are no members of the group anymore
        let resultParticipants: ParticipantType[] = [];
        group?.transactions.forEach((transaction) => {
          transaction.participants.forEach((participant) => {
            if (!resultParticipants.find((x) => x.userId === participant.id)) {
              resultParticipants.push({
                userId: participant.id,
                name: participant.firstname + ' ' + participant.lastname,
                value: 0,
              });
            }
          });
        });

        // Run through all members because it could be that some members have no transactions,
        // but we still want to show them
        group?.members.forEach((member) => {
          if (!resultParticipants.find((x) => x.userId === member.id)) {
            resultParticipants.push({
              userId: member.id,
              name: member.firstname + ' ' + member.lastname,
              value: 0,
            });
          }
        });

        // The moneypools are used to get a list of all different variants of transactions
        let moneypools: any = {};
        group.transactions.forEach((transaction) => {
          // Take the userIds of all the participants in the current transaction
          // so we can build our hashmap by concatenating the sorted ids.
          let participants = transaction.participants.map((participant) => participant.id);
          // Need to sort the ids so we always get the same order if the same participants are there
          participants.sort();

          // ! Hashes can be insanely long as we concatenate the UUIDs of all the participants
          // But we cant use SHA-1 as we then would not know which ids were involved
          // and cant split them up again
          let hash = '';
          for (let i = 0; i < participants.length; i++) {
            hash += participants[i];
            if (i < participants.length - 1) hash += ',';
          }

          // Write the value of the transaction into our hashmap of moneypools
          // Add a new entry if it does not exist
          if (!moneypools[hash]) {
            moneypools[hash] = transaction.value;
          } else {
            moneypools[hash] += transaction.value;
          }
        });

        // Now we have a hashmap of all transactions which we can use to calculate
        // the virtual balances of the members
        for (let hash in moneypools) {
          // Revert the concatenation of the ids by splitting them up again
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
            // because this is basically a balance top up, which does not get split
            // between participants
            if (moneypools[hash] >= 0) resultParticipants[index].value += moneypools[hash];

            if (moneypools[hash] < 0) {
              if (rest === 0 || rest === -0) {
                // If the rest is 0 we can just divide the transaction value by the amount of
                // participants, as there will be a whole number for everybody to add
                resultParticipants[index].value += moneypools[hash] / ids.length;
              } else {
                // If the rest is unequal to 0 we calculate the nearest whole number which we can
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
      authorize: authIsLoggedIn,
      resolve(_, args, ctx) {
        return prisma.group.create({
          data: {
            name: args.name,
            value: args.value || 0.0,
            owners: { connect: { id: ctx.user.id } },
            members: { connect: { id: ctx.user.id } },
          },
        });
      },
    });

    t.nonNull.field('updateGroup', {
      type: Group,
      description:
        'Update a already existing group. Need to be logged in and be owner of the group.',
      authorize: authIsGroupOwner,
      args: {
        groupId: nonNull(stringArg()),
        ownerId: stringArg(),
      },
      async resolve(_, args) {
        return prisma.group.update({
          where: { id: args.groupId },
          data: { owners: { connect: { id: args.ownerId || undefined } } },
        });
      },
    });

    t.nonNull.field('deleteGroup', {
      type: Group,
      description: 'Delete a existing group. Need to be logged in and owner of the group.',
      authorize: authIsGroupOwner,
      args: {
        groupId: nonNull(stringArg()),
      },
      async resolve(_, args) {
        await prisma.groupTransaction.deleteMany({ where: { groupId: args.groupId } });
        await prisma.threshold.deleteMany({ where: { groupId: args.groupId } });
        await prisma.invite.deleteMany({ where: { groupId: args.groupId } });

        return prisma.group.delete({
          where: { id: args.groupId },
        });
      },
    });

    t.nonNull.field('addGroupOwner', {
      type: Group,
      description: 'Add a new owner to a group. Need to be logged in and be owner of the group.',
      authorize: authIsGroupOwner,
      args: {
        groupId: nonNull(stringArg()),
        ownerId: stringArg(),
      },
      async resolve(_, args) {
        return prisma.group.update({
          where: { id: args.groupId },
          data: { owners: { connect: { id: args.ownerId || undefined } } },
        });
      },
    });

    t.nonNull.field('removeGroupOwner', {
      type: Group,
      description: 'Remove a owner of a group. Need to be logged in and be owner of the group.',
      authorize: authIsGroupOwner,
      args: {
        groupId: nonNull(stringArg()),
        ownerId: stringArg(),
      },
      async resolve(_, args) {
        const owners = await prisma.group.findUnique({ where: { id: args.groupId } }).owners();

        // Cant remove the last owner of a group because then nobody could manage the group.
        if (owners.length <= 1) {
          throw new ApolloError('540');
        }

        return prisma.group.update({
          where: { id: args.groupId },
          data: { owners: { disconnect: { id: args.ownerId || undefined } } },
        });
      },
    });

    t.nonNull.field('removeGroupMember', {
      type: Group,
      description:
        'Remove a member from the specified group. Need to be logged in and own the group.',
      authorize: authIsGroupOwnerOrMemberIdCurrentUser,
      args: {
        groupId: nonNull(stringArg()),
        memberId: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        const group = await prisma.group.findFirst({
          where: { id: args.groupId },
          include: { owners: true },
        });

        if (!!group?.owners.find((x) => x.id === ctx.user.id) && group!.owners.length <= 1) {
          throw new ApolloError('530');
        }

        return prisma.group.update({
          where: { id: args.groupId },
          data: {
            members: { disconnect: { id: args.memberId } },
            owners: { disconnect: { id: args.memberId } },
          },
        });
      },
    });
  },
});
