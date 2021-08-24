import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="relative w-full mx-auto sm:mt-8 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl sm:rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
      {children}
    </div>
  );
}
