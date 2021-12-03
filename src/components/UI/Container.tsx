import clsx from 'clsx';
import { CSSProperties, ReactNode } from 'react';

interface Props {
  title?: string;
  titleClassName?: string;
  action?: ReactNode;
  small?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

/**
 * Custom Container which can be used as a basic wrapper component for all content types.
 * Handles placement and responsiveness for you
 */
export function Container({
  title,
  titleClassName,
  action,
  small = false,
  children,
  style,
}: Props) {
  return (
    <div
      className={clsx(
        !small && 'md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ',
        'relative w-full mx-auto mb-4 sm:mt-8 p-6 sm:max-w-lg sm:rounded-xl shadow-lg bg-white dark:bg-gray-800',
      )}
      style={style}
    >
      {(title || action) && (
        <div className={clsx('mb-4', action && 'flex flex-wrap items-center justify-between')}>
          {title && (
            <h1
              className={clsx(
                titleClassName,
                !titleClassName &&
                  'text-3xl font-bold text-center text-gray-900 dark:text-gray-100',
              )}
            >
              {title}
            </h1>
          )}
          <div>{action}</div>
        </div>
      )}
      {children}
    </div>
  );
}
