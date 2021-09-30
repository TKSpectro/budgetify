import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';
import { prisma } from '~/utils/prisma';

export interface ContextUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface ContextInput {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  user: ContextUser;
}

export async function context({ req, res }: ContextInput): Promise<Context> {
  // Get the token from authToken cookie. This is a secure http-only cookie
  // and contains the JWT
  //const token = req.cookies.authToken || undefined;
  const token = req.headers.authorization?.replace('Bearer ', '') || '';

  let user: ContextUser = { id: '', email: '', isAdmin: false };

  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof data !== 'string') {
        let foundUser = await prisma.user.findFirst({ where: { id: data.id } });

        // If we dont find a user with the user id in the token,
        // we remove the authToken on the client side
        if (!foundUser) {
          destroyCookie({ res }, 'authToken', {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 72576000,
            httpOnly: true,
            path: '/',
          });

          throw new Error('Context: Token was not valid');
        }

        user.id = foundUser.id;
        user.email = foundUser.email;
        user.isAdmin = foundUser.isAdmin;
      }
    }
  } catch (error) {
    throw new Error('Context: Token was not valid');
  }

  return { req, res, user } as Context;
}
