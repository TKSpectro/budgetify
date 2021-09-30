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

interface Props extends ComponentProps<'a'> {
  noBorder?: boolean;
  brand?: boolean;
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
  function HeaderLink({ href, className, brand = false, noBorder = false, ...props }: Props) {
    const content = (
      <a
        className={clsx(
          'p-2 md:px-4 my-1 md:my-0 md:mx-2 text-center rounded transition-colors duration-300',
          className,
          !noBorder && 'border md:border-0 border-brand-500',
          brand && 'text-white  bg-brand-500 hover:bg-opacity-70 dark:hover:bg-opacity-80',
          !brand &&
            'text-gray-600 hover:bg-gray-300 hover:bg-opacity-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-100',
        )}
        onClick={() => {
          if (window.screen.width < 768) toggleNavbarHandler();
        }}
        {...props}
      />
    );

    return <Link href={href!}>{content}</Link>;
  }

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
              noBorder
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
                <HeaderLink href={'/households'} brand>
                  Households
                </HeaderLink>
                <HeaderLink href={'/groups'} brand>
                  Groups
                </HeaderLink>
              </>
            )}
            {router.query.householdId && (
              <>
                <HeaderLink href={'/households/' + router.query.householdId} brand>
                  Dashboard
                </HeaderLink>
                <HeaderLink
                  href={'/households/' + router.query.householdId + '/payments'}
                  className="hidden xl:block text-gray-600 dark:text-gray-200"
                >
                  Payments
                </HeaderLink>
                <HeaderLink
                  href={'/households/' + router.query.householdId + '/recurringPayments'}
                  className="hidden xl:block text-gray-600 dark:text-gray-200"
                >
                  RecurringPayments
                </HeaderLink>
                <HeaderLink href={'/households'} className="text-gray-600 dark:text-gray-200">
                  Households
                </HeaderLink>
                <HeaderLink href={'/groups'} className="text-gray-600 dark:text-gray-200">
                  Groups
                </HeaderLink>
              </>
            )}

            {!isLoggedIn && <HeaderLink href="/auth/login">Login</HeaderLink>}
            {!isLoggedIn && <HeaderLink href="/auth/signup">Signup</HeaderLink>}
            {isLoggedIn && (
              <HeaderLink href="/profile" className="text-gray-600 dark:text-gray-200">
                Profile
              </HeaderLink>
            )}

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
