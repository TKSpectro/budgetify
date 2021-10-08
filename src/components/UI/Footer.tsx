import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Link } from './Link';

export function Footer() {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <footer id="footer" className="relative z-50 dark:bg-gray-900 pt-24">
      <div className="py-8 flex justify-around items-center w-full">
        <div className="flex items-center">
          <div className="text-lg lg:text-2xl font-bold text-brand-500 dark:text-gray-50 mx-16">
            budgetify
          </div>
          <Link href="https://github.com/TKSpectro/budgetify" className="mx-16">
            {/* // https://github.com/feathericons/feather/blob/master/icons/github.svg */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </Link>
          <Link href="/imprint" className="mx-16">
            {t('common:imprint')}
          </Link>
          <Link href="/privacy" className="mx-16">
            {t('common:privacy')}
          </Link>

          {/* // Language Switcher */}
          <div className="mx-16">
            <select
              onChange={(locale) => {
                router.push(router.asPath, undefined, { locale: locale.target.value });
              }}
              value={router.locale}
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md pl-4 pr-8 py-2 border focus:border-brand-500 focus:ring-brand-500"
            >
              {router.locales?.map((locale) => {
                return (
                  <option key={locale} value={locale}>
                    {locale.toUpperCase()}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
}
