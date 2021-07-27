import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="sm:mt-6 sm:max-w-lg sm:rounded-xl w-full mx-auto shadow-lg bg-white dark:bg-gray-800 p-6">
      {children}
    </div>
  );
}
