import { AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface ContextUser {
  id: string;
  email: string;
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

export function context({ req, res }: ContextInput): Context {
  const token = req.cookies.authToken || undefined;

  if (!process.env.JWT_SECRET) {
    throw new AuthenticationError('Server is not setup correctly');
  }

  let user: ContextUser = { id: '', email: '' };

  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET);

      if (typeof data !== 'string') {
        user.id = data.id;
        user.email = data.email;
      }
    }
  } catch (error) {
    // TODO: handle error?
    throw Error('Context: Token was not valid');
  }

  return { req, res, user } as Context;
}
