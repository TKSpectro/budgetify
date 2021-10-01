import Head from 'next/head';
import { Link } from '~/components/UI/Link';

export default function Custom404() {
  return (
    <div>
      <Head>
        <title>404 - Not found | budgetify</title>
      </Head>
      <div className="bg-gradient-to-b from-gray-200 to-brand-500 dark:from-gray-800 dark:to-brand-600">
        <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
          <div className="bg-gray-200 dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg pb-8">
            <div className="text-center pt-8">
              <h1 className="text-9xl font-bold text-brand-500">404</h1>
              <h2 className="text-6xl font-medium py-8">Page not found</h2>
              <div className="text-2xl pb-8 px-12 font-medium">
                The page you are looking for does not exist. It might have been moved or deleted.
              </div>
              <Link
                href="/"
                className="bg-brand-500 text-white font-semibold px-6 py-3 rounded-md mr-6"
              >
                HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
