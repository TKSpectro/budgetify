import type { NextApiRequest } from 'next';

export function context({ req }: { req: NextApiRequest }) {
  // Get the user token from the header
  const token = req.headers.authorization || '';

  // TODO: Get user
  const user = { id: 'longId', email: 'email' };

  return { user };
}
