import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  big?: boolean;
}

export function Container({ children, big = false }: Props) {
  return (
    <div
      className={clsx(
        !big &&
          'relative w-full mx-auto mt-8 sm:mt-8 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl sm:rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6',
        big &&
          'relative container mx-auto mt-8 sm:mt-8 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl sm:rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6',
      )}
    >
      {children}
    </div>
  );
}
