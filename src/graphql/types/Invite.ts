import { objectType } from 'nexus';
import prisma from '~/utils/prisma';
import { Household, User } from '.';

export const Invite = objectType({
  name: 'Invite',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.field('validUntil', { type: 'DateTime' });
    t.nonNull.boolean('wasUsed');
    t.nonNull.string('invitedEmail', { description: 'The email of the person which was invited.' });
    t.nonNull.string('link', {
      description: 'The link which can be used from invited person to use the invite.',
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
