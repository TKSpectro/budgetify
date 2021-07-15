import { objectType, extendType, nonNull, stringArg } from 'nexus';
import prisma from '@/utils/prisma';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '.';
import { AuthenticationError } from 'apollo-server-micro';

export const AuthToken = objectType({
  name: 'AuthToken',
  definition(t) {
    t.nonNull.string('token');
  },
});

export const AuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: User,
      async resolve(_, __, ctx) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: ctx.user.id || undefined,
            },
          });

          if (!user) {
            return null;
          }

          // filter out the hashed password from the response
          return {
            ...user,
            hashedPassword: '',
          };
        } catch (error) {
          throw new AuthenticationError('You are not logged in.');
        }
      },
    });
  },
});

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
      async resolve(_, args, ctx) {
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
