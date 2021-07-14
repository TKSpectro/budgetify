import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-micro';

export function context({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  // Get the user token from the header and if it exists split it up
  let token: any;
  token = req.headers.authorization;

  if (token) {
    try {
      token = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      throw new AuthenticationError('Authentication token is invalid, please log in again.');
    }
  }

  const user = { id: token ? token.id : null, email: token ? token.email : null };

  return { user, req, res };
}
