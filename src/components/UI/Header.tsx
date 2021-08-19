import { gql, useQuery } from '@apollo/client';
import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ComponentProps, useState } from 'react';
import { preloadQuery } from '~/utils/apollo';
import { Button } from './Button';
import { CustomLink } from './CustomLink';

export interface LinkProps extends ComponentProps<'a'> {}

export function HeaderLink({ href, ...props }: LinkProps) {
  // TODO: Check for currently active link with router.url? to highlight on which page you currently are

  const content = (
    <a
      className="p-2 lg:px-4 md:mx-2 text-gray-600 dark:text-gray-200 rounded hover:bg-gray-700 hover:text-gray-700 transition-colors duration-300"
      {...props}
    />
  );

  return <Link href={href!}>{content}</Link>;
}

export const MeQuery = gql`
  query Me {
    me {
      id
      firstname
      lastname
      email
    }
  }
`;

export function Header() {
  const [navBarCollapsed, setNavBarCollapsed] = useState(false);
  const { data, loading, error } = useQuery(MeQuery);

  const isLoggedIn = data?.me?.id;

  function toggleNavbarHandler() {
    setNavBarCollapsed(!navBarCollapsed);
  }

  return (
    <div className="header-2 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-400 dark:border-gray-700">
      <nav className="py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <CustomLink href="/" className="font-bold text-xl text-brand-400">
              budgetify
            </CustomLink>

            <div className="md:hidden">
              <Button onClick={toggleNavbarHandler}>
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div
            className={clsx('md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0', {
              flex: navBarCollapsed === true,
              hidden: navBarCollapsed === false,
            })}
          >
            <HeaderLink
              href="/households"
              className="p-2 lg:px-4 md:mx-2 text-white rounded bg-brand-500"
            >
              Dashboard
            </HeaderLink>
            <HeaderLink href="/">Features</HeaderLink>
            <HeaderLink href="/">Pricing</HeaderLink>
            <HeaderLink href="/">Contact</HeaderLink>
            {!isLoggedIn && (
              <CustomLink
                href="/auth/login"
                className="p-2 lg:px-4 md:mx-2 text-brand-500 text-center border border-transparent rounded hover:bg-brand-600 hover:text-white transition-colors duration-300"
              >
                Login
              </CustomLink>
            )}
            {!isLoggedIn && (
              <CustomLink
                href="/auth/signup"
                className="p-2 lg:px-4 md:mx-2 text-brand-500 text-center border border-solid border-brand-600 rounded hover:bg-brand-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1"
              >
                Signup
              </CustomLink>
            )}
            {isLoggedIn && (
              <CustomLink
                href="/profile"
                className="p-2 lg:px-4 md:mx-2 text-brand-500 text-center border border-transparent rounded hover:bg-brand-600 hover:text-white transition-colors duration-300"
              >
                Profile
              </CustomLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: MeQuery,
  });
