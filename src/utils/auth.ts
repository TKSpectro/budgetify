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

// TODO: Need better implementation for checking for owner and stuff like that
// Maybe a object and specify a list of keys for better usage.

// This function can be called in the getServerSideProps function of a component
// to enforce that the user is logged in, else we will redirect him to either
// the login page or a given route
export async function authenticatedRoute(
  context: GetServerSidePropsContext,
  redirect = '/auth/login',
  checkOwnerOfHouseholdId?: string,
  checkOwnerOfGroupId?: string,
): Promise<GetServerSidePropsResult<{}>> {
  try {
    // Check if the send authToken is a valid jwt.
    const data = jwt.verify(context.req.cookies.authToken, process.env.JWT_SECRET!) as EncodedToken;
    if (!data.id) throw new AuthenticationError('Client sent a non valid jwt');

    // Check if there is an actual user with the sent userId.
    const user = await prisma.user.findFirst({ where: { id: data.id } });
    if (!user) throw new AuthenticationError('Client sent a non valid jwt');

    // If checkOwner is given we look up if the currently logged in user owns the household, which
    // wants to get accessed. If the user does not own it, redirect him.
    if (checkOwnerOfHouseholdId) {
      const householdOwner = await prisma.user
        .findUnique({ where: { id: data.id } })
        .ownedHouseholds({ where: { id: checkOwnerOfHouseholdId } });

      if (householdOwner.length === 0) {
        context.res.writeHead(302, {
          Location: '/households/' + checkOwnerOfHouseholdId,
        });
        context.res.end();
      }
    }

    // If checkOwnerOfGroupId is given we look up if the currently logged in user owns the group, which
    // wants to get accessed. If the user does not own it, redirect him.
    if (checkOwnerOfGroupId) {
      const groupOwner = await prisma.user
        .findUnique({ where: { id: data.id } })
        .ownedGroups({ where: { id: checkOwnerOfGroupId } });

      if (groupOwner.length === 0) {
        context.res.writeHead(302, {
          Location: '/groups/' + checkOwnerOfGroupId,
        });
        context.res.end();
      }
    }
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
