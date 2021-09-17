import { ApolloError, AuthenticationError } from 'apollo-server-micro';
import { compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { destroyCookie, setCookie } from 'nookies';
import prisma from '~/utils/prisma';

export const AuthToken = objectType({
  name: 'AuthToken',
  description: `HelperType: Contains a JWT string (JSON-Web-Token) 
    for the authentication of the user.`,
  definition(t) {
    t.nonNull.string('token');
  },
});

export const AuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User' || null,
      description:
        'Returns the data of the currently logged in user. Returns null if no user is logged in',
      async resolve(_, __, ctx) {
        // User is not logged in.
        if (!ctx.user?.id) {
          return null;
        }

        // Find the user by the id saved in the context
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
      },
    });
  },
});

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('signup', {
      type: AuthToken,
      description: `This mutation takes the values for a new user as arguments. 
      Saves them and returns a JWT (JSON-Web-Token) 
      for further authentication with the graphql-api.`,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstname: nonNull(stringArg()),
        lastname: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        args.password = hashSync(args.password, 10);

        try {
          const user = await prisma.user.create({
            data: {
              email: args.email,
              hashedPassword: args.password,
              firstname: args.firstname,
              lastname: args.lastname,
            },
          });

          const { id } = user;

          const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
            expiresIn: '30d',
          });

          setCookie(ctx, 'authToken', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 72576000,
            httpOnly: true,
            path: '/',
          });

          return {
            token,
          };
        } catch (error) {
          // TODO: Figure out which error was thrown
          throw new AuthenticationError(
            'Error while signing up. Probably a user exists with the send email',
          );
        }
      },
    });
    t.nonNull.field('login', {
      type: AuthToken,
      description: `This mutation takes the email and password of an existing user.
      Returns a JWT (JSON-Web-Token) for further authentication with the graphql-api.`,
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
          throw new ApolloError('Authorization Error');
        }
        const { id, hashedPassword } = user;
        if (!compareSync(args.password, hashedPassword)) {
          throw new Error('Authorization Error');
        }

        const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
          expiresIn: '30d',
        });

        setCookie(ctx, 'authToken', token, {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 72576000,
          httpOnly: true,
          path: '/',
        });

        return {
          token,
        };
      },
    });
    t.field('logout', {
      type: 'String',
      description: `This mutation removes the authToken on the user side.`,
      resolve(_, __, ctx) {
        destroyCookie(ctx, 'authToken', {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 72576000,
          httpOnly: true,
          path: '/',
        });

        return 'Logged out!';
      },
    });
  },
});
