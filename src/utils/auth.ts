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

// Checks which can be used to check for authorization to specific things e.g. groups
export enum AuthRouteChecks {
  CHECK_HOUSEHOLD_OWNER = 'CHECK_HOUSEHOLD_OWNER',
  CHECK_GROUP_OWNER = 'CHECK_GROUP_OWNER',
}

//TODO: Figure out how to get access to auth header stuff
// This function can be called in the getServerSideProps function of a component
// to enforce that the user is logged in, else we will redirect him to either
// the login page or a given route
export async function authenticatedRoute(
  context: GetServerSidePropsContext,
  redirect = '/auth/login',
  checks?: { [key in AuthRouteChecks]?: string },
): Promise<GetServerSidePropsResult<{}>> {
  try {
    console.log(context.req.cookies);
    // Check if the send authToken is a valid jwt.
    const data = jwt.verify(
      context.req.headers.authorization?.replace('Bearer ', '') || '',
      process.env.JWT_SECRET!,
    ) as EncodedToken;
    if (!data.id) throw new AuthenticationError('Client sent a non valid jwt');

    // Check if there is an actual user with the sent userId.
    const user = await prisma.user.findFirst({ where: { id: data.id } });
    if (!user) throw new AuthenticationError('Client sent a non valid jwt');

    let redirectCheckLocation: string = '';
    // If any checks were given, look for specific one and if they were found check them
    if (checks) {
      // Checks if the logged in user owns the requested household
      if (checks['CHECK_HOUSEHOLD_OWNER']) {
        const householdOwner = await prisma.user
          .findUnique({ where: { id: data.id } })
          .ownedHouseholds({ where: { id: checks['CHECK_HOUSEHOLD_OWNER'] } });

        if (householdOwner.length === 0) {
          redirectCheckLocation = '/households/' + checks['CHECK_HOUSEHOLD_OWNER'];
        }
      }
      // Checks if the logged in user is one of the owners of the requested group
      if (checks['CHECK_GROUP_OWNER']) {
        const groupOwner = await prisma.user
          .findUnique({ where: { id: data.id } })
          .ownedGroups({ where: { id: checks['CHECK_GROUP_OWNER'] } });

        if (groupOwner.length === 0) {
          redirectCheckLocation = '/groups/' + checks['CHECK_GROUP_OWNER'];
        }
      }
    }

    // If any check occured we can redirect to the set location
    if (redirectCheckLocation) {
      context.res.writeHead(302, {
        Location: redirectCheckLocation,
      });
      context.res.end();
    }
  } catch (error) {
    // If the user sent a token thats not valid, then we just reset the cookie on their side.
    // And redirect to the login page.
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
