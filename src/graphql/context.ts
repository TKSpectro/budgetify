import { AuthenticationError } from 'apollo-server-micro';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import i18n from 'next-i18next.config';
import { destroyCookie } from 'nookies';
import { prisma } from '~/utils/prisma';

export interface ContextUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface ContextInput {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  user: ContextUser;
  locale: string;
}

export async function context({ req, res }: ContextInput): Promise<Context> {
  // Get the token from authToken cookie. This is a secure http-only cookie
  // and contains the JWT
  const token = req.cookies.authToken || undefined;

  let user: ContextUser = { id: '', email: '', isAdmin: false };

  try {
    if (token) {
      const data = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof data !== 'string') {
        let foundUser = await prisma.user.findFirst({ where: { id: data.id } });

        // If we dont find a user with the user id in the token,
        // we remove the authToken on the client side
        if (!foundUser) {
          destroyCookie({ res }, 'authToken', {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 72576000,
            httpOnly: true,
            path: '/',
          });

          throw new AuthenticationError('Token is not valid. Please login again.');
        }

        user.id = foundUser.id;
        user.email = foundUser.email;
        user.isAdmin = foundUser.isAdmin;
      }
    }
  } catch (error) {
    destroyCookie({ res }, 'authToken', {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 72576000,
      httpOnly: true,
      path: '/',
    });

    throw new AuthenticationError('Token is not valid. Please login again.');
  }

  const locale = determineUserLang(req.headers['accept-language']?.split(',') || []);

  return { req, res, user, locale } as Context;
}

export function determineUserLang(acceptedLangs: string[]) {
  const supportedLangs = i18n.i18n.locales;
  const defaultLang = i18n.i18n.defaultLocale;

  const acceptedLangCodes = acceptedLangs.map(stripCountry);
  const supportedLangCodes = Object.values(supportedLangs);
  const matchingLangCode = acceptedLangCodes.find((code) => supportedLangCodes.includes(code));

  return matchingLangCode || defaultLang;
}
function stripCountry(lang: string) {
  return lang.trim().replace('_', '-').split('-')[0];
}
