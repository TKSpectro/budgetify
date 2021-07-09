import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const AuthToken = objectType({
  name: 'AuthToken',
  definition(t) {
    t.nonNull.string('token');
  },
});

// export const CategoryQuery = extendType({
//   type: 'Query',
//   definition(t) {
//     t.nonNull.list.field('categories', {
//       type: 'Category',
//       resolve() {
//         return prisma.category.findMany();
//       },
//     });
//     t.field('category', {
//       type: 'Category',
//       args: {
//         id: stringArg(),
//         name: stringArg(),
//       },
//       resolve(_, { id, name }) {
//         return prisma.category.findFirst({
//           where: {
//             id: id || undefined,
//             name: name || undefined,
//           },
//         });
//       },
//     });
//   },
// });

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('signup', {
      type: AuthToken,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstname: nonNull(stringArg()),
        lastname: nonNull(stringArg()),
      },
      async resolve(_, args) {
        args.password = hashSync(args.password, 10);

        const user = await prisma.user.create({
          data: {
            email: args.email,
            hashedPassword: args.password,
            firstname: args.firstname,
            lastname: args.lastname,
          },
        });
        const { id, email } = user;

        // TODO: Need to check if the secret is actually set
        return { token: jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: '30d' }) };
      },
    });
    t.nonNull.field('login', {
      type: AuthToken,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args) {
        const user = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        if (!user) {
          throw new Error('Authorization Error');
        }
        const { id, email, hashedPassword } = user;
        if (!compareSync(args.password, hashedPassword)) {
          throw new Error('Authorization Error');
        }

        return {
          token: jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: '30d' }),
        };
      },
    });
  },
});
