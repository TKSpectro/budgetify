import { arg, enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import prisma from '~/utils/prisma';
import { authIsGroupOwner } from '../authRules';

export const ThresholdType = enumType({
  name: 'ThresholdType',
  members: ['MIN', 'MAX', 'GOAL'],
});

export const Threshold = objectType({
  name: 'Threshold',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.money('value');
    t.nonNull.field('type', { type: ThresholdType });
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
      authorize: authIsGroupOwner,
      args: {
        name: nonNull(stringArg()),
        value: nonNull(arg({ type: 'Money' })),
        type: nonNull(arg({ type: ThresholdType })),
        groupId: nonNull(stringArg()),
      },
      resolve(_, args) {
        return prisma.threshold.create({
          data: {
            name: args.name,
            value: args.value,
            type: args.type,
            groupId: args.groupId,
          },
        });
      },
    });
  },
});
