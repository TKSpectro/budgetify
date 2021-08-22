import { AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { prisma } from './prisma';

type EncodedToken = {
  id: string;
  email: string;
  isEmail: boolean;
  iat: number;
  exp: number;
};

// This function can be called in the getServerSideProps function of a component
// to enforce that the user is logged in, else we will redirect him to either
// the login page or a given route
export async function authenticatedRoute(
  context: GetServerSidePropsContext,
  redirect = '/auth/login',
): Promise<GetServerSidePropsResult<{}>> {
  try {
    // Check if the send authToken is a valid jwt.
    const data = jwt.verify(context.req.cookies.authToken, process.env.JWT_SECRET!) as EncodedToken;
    if (!data.id) throw new AuthenticationError('Client sent a non valid jwt');

    // Check if there is an actual user with the sent userId.
    const user = await prisma.user.findFirst({ where: { id: data.id } });
    if (!user) throw new AuthenticationError('Client sent a non valid jwt');
  } catch (error) {
    context.res.writeHead(302, {
      Location: redirect,
      // https://stackoverflow.com/questions/65160156/remove-cookies-and-sign-out-server-side-in-next-js
      // Set the cookie to a max-age of 0, so it will be deleted immediately.
      'Set-Cookie': 'authToken=deleted; Max-Age=0',
    });
    context.res.end();
  }
  return {
    props: {},
  };
}
