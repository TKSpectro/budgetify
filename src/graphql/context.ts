import { AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

export function context(req: NextApiRequest) {
  const token = req.headers.authorization || null;

  if (!process.env.JWT_SECRET) {
    throw new AuthenticationError('Server is not setup correctly');
  }

  let user: string | jwt.JwtPayload = {};
  if (token) {
    user = jwt.verify(token, process.env.JWT_SECRET);
  }

  return { user };
}
