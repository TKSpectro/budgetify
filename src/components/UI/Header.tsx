import { gql, useQuery } from '@apollo/client';
import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps, useState } from 'react';
import { preloadQuery } from '~/utils/apollo';
import { ThemeSwitch } from '../ThemeSwitch';
import { Button } from './Button';

interface Props extends ComponentProps<'a'> {}

export function HeaderLink({ href, ...props }: Props) {
  const content = (
    <a
      className={clsx(
        'p-2 lg:px-4 md:mx-2 text-gray-600 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700  transition-colors duration-300',
      )}
      {...props}
    />
  );

  return <Link href={href!}>{content}</Link>;
}

export const ME_QUERY = gql`
  query ME_QUERY {
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
  const { data, loading, error } = useQuery(ME_QUERY);

  const router = useRouter();

  const isLoggedIn = data?.me?.id;

  function toggleNavbarHandler() {
    setNavBarCollapsed(!navBarCollapsed);
  }

  return (
    <div className="header-2 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-400 dark:border-gray-700">
      <nav className="py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <HeaderLink
              className="text-2xl text-brand-500 dark:text-brand-500 font-medium"
              href="/"
            >
              budgetify
            </HeaderLink>

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
            {!router.query.householdId && isLoggedIn && (
              <>
                <HeaderLink
                  href={'/households'}
                  className="p-2 lg:px-4 md:mx-2 text-white rounded bg-brand-500"
                >
                  Households
                </HeaderLink>
                <HeaderLink
                  href={'/groups'}
                  className="p-2 lg:px-4 md:mx-2 text-white rounded bg-brand-500"
                >
                  Groups
                </HeaderLink>
              </>
            )}
            {router.query.householdId && (
              <>
                <HeaderLink
                  href={'/households/' + router.query.householdId}
                  className="p-2 lg:px-4 md:mx-2 text-white rounded font-medium bg-brand-500 hover:bg-opacity-90"
                >
                  Dashboard
                </HeaderLink>
                <HeaderLink href={'/households/' + router.query.householdId + '/payments'}>
                  Payments
                </HeaderLink>
                <HeaderLink href={'/households/' + router.query.householdId + '/recurringPayments'}>
                  Recurring Payments
                </HeaderLink>
                <HeaderLink href={'/groups'}>Groups</HeaderLink>
                <HeaderLink href={'/households'}>Households</HeaderLink>
              </>
            )}

            {!isLoggedIn && <HeaderLink href="/auth/login">Login</HeaderLink>}
            {!isLoggedIn && <HeaderLink href="/auth/signup">Signup</HeaderLink>}
            {isLoggedIn && <HeaderLink href="/profile">Profile</HeaderLink>}
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) =>
  preloadQuery(ctx, {
    query: ME_QUERY,
  });
