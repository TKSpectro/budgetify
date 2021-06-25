import { objectType, queryType } from 'nexus';
import prisma from '../../utils/prisma';

export const Company = objectType({
  name: 'Company',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('symbol');
    t.string('description');
  },
});

export const Query = queryType({
  definition(t) {
    t.field('company', {
      type: Company,
      resolve: () => {
        return prisma.company.findFirst();
      },
    });
  },
});
