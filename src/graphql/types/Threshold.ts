import { arg, enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';

export const ThresholdTrigger = enumType({
  name: 'ThresholdTrigger',
  members: ['OVER', 'UNDER'],
});

export const Threshold = objectType({
  name: 'Threshold',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.field('trigger', { type: ThresholdTrigger });
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.field('group', {
      type: 'Group',
      description: 'The group to which this trigger is hooked.',
      resolve(source) {
        return prisma.group.findUnique({
          where: {
            id: source.groupId,
          },
        });
      },
    });
    t.nonNull.string('groupId');
  },
});

export const ThresholdMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createThreshold', {
      type: 'Threshold',
      description: 'Create a new threshold. Need to be logged in and own group.',
      authorize: async (_, args, ctx) => {
        const group = await prisma.group.findFirst({
          where: { id: args.groupId },
          include: { owners: true },
        });
        // Check if the user is the owner of the group.
        const groupOwner = group?.owners.find((x) => x.id === ctx.user.id);
        // User must be logged in and own the household
        return !!ctx.user && !!groupOwner;
      },
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
        trigger: nonNull(arg({ type: ThresholdTrigger })),
        groupId: nonNull(stringArg()),
      },
      resolve(_, args) {
        return prisma.threshold.create({
          data: {
            name: args.name,
            value: args.value,
            trigger: args.trigger,
            groupId: args.groupId,
          },
        });
      },
    });
  },
});
