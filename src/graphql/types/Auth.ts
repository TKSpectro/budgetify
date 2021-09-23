import { ApolloError, AuthenticationError } from 'apollo-server-micro';
import { compareSync, hashSync } from 'bcrypt';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import { destroyCookie, setCookie } from 'nookies';
import prisma from '~/utils/prisma';
import { createNodemailerTransporter } from '../helper';

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

    t.nonNull.field('requestPasswordReset', {
      type: 'String',
      description: 'This mutation creates a otp for a user and sends it to the users email.',
      args: {
        email: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        try {
          const user = await prisma.user.update({
            where: {
              email: args.email,
            },
            data: {
              otp: randomUUID(),
            },
          });
          if (user) {
            const { email, otp } = user;

            const transporter = createNodemailerTransporter({});
            if (transporter) {
              const mailOptions: MailOptions = {
                from: `${process.env.DOMAIN} <no-reply@${process.env.DOMAIN}>`,
                to: email,
                subject: 'budgetify | Password reset requested',
                text: `OTP: ${otp}`,
              };

              // Send mail and close the connection
              transporter.sendMail(mailOptions);
              transporter.close();
            }
          }
        } catch (error) {
          // We just need to try-catch because we dont wont to send the user any errors.
          // Instead we just give the the return text
        }

        return 'If account exists, an email will be sent with further instructions.';
      },
    });

    t.nonNull.field('resetPassword', {
      type: 'User',
      description: 'Reset a users password with a valid OTP.',
      args: {
        email: nonNull(stringArg()),
        otp: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, ctx) {
        args.password = hashSync(args.password, 10);

        const foundUser = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });

        if (!foundUser || foundUser?.otp !== args.otp) {
          throw new ApolloError('No account found for the given email or OTP is not valid.');
        }

        const user = await prisma.user.update({
          where: {
            email: args.email,
          },
          data: {
            hashedPassword: args.password,
            otp: null,
          },
        });

        return user;
      },
    });
  },
});
