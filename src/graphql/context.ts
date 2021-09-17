import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
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
  const token = req.cookies.authToken || undefined;

  let user: ContextUser = { id: '', email: '', isAdmin: false };

  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof data !== 'string') {
        const foundUser = await prisma.user.findFirst({ where: { id: data.id } });

        // If we find a user in the database the token with the userId was valid
        if (!foundUser) {
          throw Error('Context: Token was not valid');
        }

        user.id = foundUser.id;
        user.email = foundUser.email;
        user.isAdmin = foundUser.isAdmin;
      }
    }
  } catch (error) {
    throw Error('Context: Token was not valid');
  }

  return { req, res, user } as Context;
}
