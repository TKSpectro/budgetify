import { AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

export function context({ req }: { req: NextApiRequest }) {
  const token = req.cookies.authToken || null;

  if (!process.env.JWT_SECRET) {
    throw new AuthenticationError('Server is not setup correctly');
  }

  let user: string | jwt.JwtPayload = {};
  if (token) {
    user = jwt.verify(token, process.env.JWT_SECRET);
  }

  return { user };
}
