import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { ClientOnly } from './ClientOnly';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  function handleChange() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  // Clean and good looking implementation of a switch (link is for vue -> small changes)
  // https://medium.com/front-end-weekly/build-a-html-toggle-switch-in-just-7-lines-of-code-using-vue-tailwindcss-ed215394fcd
  // Also add icons depending on the state
  return (
    <ClientOnly>
      <div className="items-center" onClick={handleChange}>
        <div
          className={clsx(
            'w-16 h-10 items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out',
            { 'bg-brand-400': theme !== 'light' },
          )}
        >
          <div
            className={clsx(
              'bg-white dark:bg-gray-800 w-8 h-8 rounded-full shadow-md transform duration-300 ease-in-out',
              { 'translate-x-6': theme! == 'light' },
            )}
          >
            {theme === 'light' ? (
              <SunIcon className="w-8 h-8 " />
            ) : (
              <MoonIcon className="w-8 h-8 text-brand-400" />
            )}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
