import { ReactNode } from 'react';

interface Props {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Container({ title, action, children }: Props) {
  return (
    <div className="relative w-full mx-auto mt-8 mb-4 sm:mt-8 p-6 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl sm:rounded-xl shadow-lg bg-white dark:bg-gray-800 ">
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
