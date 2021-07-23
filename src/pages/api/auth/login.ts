import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

// Because i want to use http-only secure cookies i have to use a api-endpoint
// to set the cookie, because we cant set a http-only cookie from graphql and
// cant set it in the frontend (thats the whole point of using http-only)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result = { token: '' };

  // Request the actual graphql backend with the login mutation
  const fetchRes = await fetch(`${req.headers.origin}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation Login {
          login(email: "${req.body.email}", password: "${req.body.password}") {
            token
          }
        }`,
    }),
  });

  // Use the returned token to set a http-only cookie
  const data = await fetchRes.json();
  result.token = data.data?.login?.token || '';

  setCookie({ res }, 'authToken', result.token, {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 72576000,
    httpOnly: true,
    path: '/',
  });

  res.status(200).json({});
}
