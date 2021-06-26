import { queryType } from 'nexus';
import prisma from '../../utils/prisma';
import { Category } from './Category';

export const Query = queryType({
  definition(t) {
    t.field('category', {
      type: Category,
      resolve: () => {
        return prisma.category.findFirst();
      },
    });
  },
});
