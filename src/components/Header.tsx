import { gql, useQuery } from '@apollo/client';
import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ComponentProps, useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import { Button } from './UI/Button';
import { Logo } from './UI/Logo';
import { MeQuery, MeQueryVariables } from './__generated__/Header.generated';

interface Props extends ComponentProps<'a'> {
  noBorder?: boolean;
  brand?: boolean;
  logo?: boolean;
}

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      firstname
      lastname
      email
    }
  }
`;

export function Header() {
  const router = useRouter();

  const { t } = useTranslation('common');

  function HeaderLink({
    href,
    className,
    brand = false,
    noBorder = false,
    logo = false,
    ...props
  }: Props) {
    const content = (
      <a
        className={clsx(
          'text-center rounded transition-colors duration-300',
          className,
          !noBorder && ' border md:border-0 border-brand-500',
          brand && ' text-white  bg-brand-500 hover:bg-opacity-70 dark:hover:bg-opacity-80',
          !brand &&
            !logo &&
            ' text-gray-600 dark:text-gray-200 hover:bg-gray-300 hover:bg-opacity-100 dark:hover:bg-gray-700 dark:hover:bg-opacity-100 ',
          logo && 'text-2xl text-brand-500 dark:text-brand-500 font-bold',
          !logo && 'p-2 md:px-4 my-1 md:my-0 md:mx-2',
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
  const { data } = useQuery<MeQuery, MeQueryVariables>(ME_QUERY);

  const isLoggedIn = data?.me?.id;

  function toggleNavbarHandler() {
    setNavBarCollapsed(!navBarCollapsed);
  }

  return (
    <div className="header-2 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-400 dark:border-gray-700">
      <nav className="py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <HeaderLink href="/" logo noBorder className=" flex ">
              <Logo width="160" height="37" />
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
            {router.query.householdId && (
              <>
                <HeaderLink href={'/households/' + router.query.householdId}>
                  {t('dashboard')}
                </HeaderLink>
                <HeaderLink
                  href={'/households/' + router.query.householdId + '/payments'}
                  className="hidden xl:block"
                >
                  {t('payments')}
                </HeaderLink>
                <HeaderLink
                  href={'/households/' + router.query.householdId + '/recurringPayments'}
                  className="hidden xl:block"
                >
                  {t('recurringPayments')}
                </HeaderLink>
                <div className="w-0.5 rounded-md bg-gray-500 dark:bg-gray-200 opacity-50"></div>
              </>
            )}

            {isLoggedIn && (
              <>
                <HeaderLink href={'/'}>{t('home')}</HeaderLink>
                <HeaderLink href="/profile">{t('profile')}</HeaderLink>
              </>
            )}

            {!isLoggedIn && (
              <>
                <HeaderLink href="/auth/login">Login</HeaderLink>
                <HeaderLink href="/auth/signup">Signup</HeaderLink>
              </>
            )}
            <div className="md:ml-4">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
