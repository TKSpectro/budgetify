import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useTheme } from 'next-themes';
import { ClientOnly } from './ClientOnly';
import { Switch } from './UI/Switch';

/**
 * Component for easy theme switching
 */
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  // Clean and good looking implementation of a switch (link is for vue.js -> small changes)
  // https://medium.com/front-end-weekly/build-a-html-toggle-switch-in-just-7-lines-of-code-using-vue-tailwindcss-ed215394fcd
  // Also added icons depending on the state
  return (
    <ClientOnly>
      <Switch
        isLeft={theme !== 'light'}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        leftIcon={<SunIcon className="w-8 h-8" />}
        rightIcon={<MoonIcon className="w-8 h-8 text-brand-400" />}
        big
      />
    </ClientOnly>
  );
}
