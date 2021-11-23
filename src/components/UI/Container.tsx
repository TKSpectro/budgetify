import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  title?: string;
  titleClassName?: string;
  action?: ReactNode;
  children: ReactNode;
}

/**
 * Custom Container which can be used as a basic wrapper component for all content types.
 * Handles placement and responsiveness for you
 */
export function Container({ title, titleClassName, action, children }: Props) {
  return (
    <div className="relative w-full mx-auto mb-4 sm:mt-8 p-6 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl sm:rounded-xl shadow-lg bg-white dark:bg-gray-800 ">
      {(title || action) && (
        <div className="lg:flex items-center justify-between mb-4">
          {title && (
            <h1
              className={clsx(
                titleClassName,
                !titleClassName && 'text-3xl font-bold text-gray-900 dark:text-gray-100',
              )}
            >
              {title}
            </h1>
          )}
          <div className="mt-4 lg:mt-0">{action}</div>
        </div>
      )}
      {children}
    </div>
  );
}
