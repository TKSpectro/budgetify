import { MenuIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState } from 'react';
import { Button } from './Button';

export default function Header() {
  const [navBarCollapsed, setNavBarCollapsed] = useState(false);

  function toggleNavbarHandler() {
    setNavBarCollapsed(!navBarCollapsed);
  }

  // TODO: Use custom Button and Link components

  return (
    <div className="header-2">
      <nav className="bg-white py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <a href="#" className="font-bold text-xl text-brand-600">
              budgetify
            </a>
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
            <a href="#" className="p-2 lg:px-4 md:mx-2 text-white rounded bg-brand-600">
              Home
            </a>
            <a
              href="#"
              className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#"
              className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#"
              className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            >
              Pricing
            </a>
            <a
              href="#"
              className="p-2 lg:px-4 md:mx-2 text-gray-600 rounded hover:bg-gray-200 hover:text-gray-700 transition-colors duration-300"
            >
              Contact
            </a>
            <a
              href="/auth/login"
              className="p-2 lg:px-4 md:mx-2 text-brand-600 text-center border border-transparent rounded hover:bg-brand-100 hover:text-brand-700 transition-colors duration-300"
            >
              Login
            </a>
            <a
              href="/auth/signup"
              className="p-2 lg:px-4 md:mx-2 text-brand-600 text-center border border-solid border-brand-600 rounded hover:bg-brand-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1"
            >
              Signup
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
