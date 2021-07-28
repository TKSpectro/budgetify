import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { ComponentProps, useState } from 'react';
import { ThemeSwitch } from '../ThemeSwitch';
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

export default function Header() {
  const [navBarCollapsed, setNavBarCollapsed] = useState(false);

  function toggleNavbarHandler() {
    setNavBarCollapsed(!navBarCollapsed);
  }

  // TODO: Use custom Button and Link components

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
            <HeaderLink href="/" className="p-2 lg:px-4 md:mx-2 text-white rounded bg-brand-600">
              Home
            </HeaderLink>
            <HeaderLink href="/households">Dashboard</HeaderLink>
            <HeaderLink href="/">Features</HeaderLink>
            <HeaderLink href="/">Pricing</HeaderLink>
            <HeaderLink href="/">Contact</HeaderLink>
            <ThemeSwitch />
            <CustomLink
              href="/auth/login"
              className="p-2 lg:px-4 md:mx-2 text-brand-600 text-center border border-transparent rounded hover:bg-brand-600 hover:text-white transition-colors duration-300"
            >
              Login
            </CustomLink>
            <CustomLink
              href="/auth/signup"
              className="p-2 lg:px-4 md:mx-2 text-brand-600 text-center border border-solid border-brand-600 rounded hover:bg-brand-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1"
            >
              Signup
            </CustomLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
