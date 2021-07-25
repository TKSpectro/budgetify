import jwt from 'jsonwebtoken';
import { GetServerSidePropsResult } from 'next';
import { Context } from '~/graphql/context';

export async function authenticatedRoute(
  context: Context,
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
