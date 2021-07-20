import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

// Because i want to use http-only secure cookies i have to use a api-endpoint
// to set the cookie, because we cant set a http-only cookie from graphql and
// cant set it in the frontend (thats the whole point of using http-only)
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // We just remove the formerly set cookie
  destroyCookie({ res }, 'authToken', {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
  });
  res.status(200).json({});
}
