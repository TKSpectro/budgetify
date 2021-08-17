import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="mx-4 my-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 p-6 sm:w-full sm:mx-auto sm:mt-6 sm:max-w-lg sm:mb-0">
      {children}
    </div>
  );
}
