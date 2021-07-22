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
  // Get the token from authToken cookie. This is a secure http-only cookie
  // and contains the JWT
  const token = req.cookies.authToken || undefined;

  let user: ContextUser = { id: '', email: '' };

  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET!);

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
