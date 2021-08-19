import jwt from 'jsonwebtoken';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

// This function can be called in the getServerSideProps function of a component
// to enforce that the user is logged in, else we will redirect him to either
// the login page or a given route
export async function authenticatedRoute(
  context: GetServerSidePropsContext,
  redirect = '/auth/login',
): Promise<GetServerSidePropsResult<{}>> {
  let data;
  try {
    data = jwt.verify(context.req.cookies.authToken, process.env.JWT_SECRET!);
  } catch (error) {
    context.res.writeHead(302, { Location: redirect });
    context.res.end();
  }
  return {
    props: {},
  };
}
