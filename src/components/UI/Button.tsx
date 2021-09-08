import clsx from 'clsx';
import { ComponentProps } from 'react';

export interface Props extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'transparent';
  className?: string;
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center px-6 py-2 rounded font-medium hover:bg-opacity-90 ' +
          (className ? ' ' + className : ''),
        {
          'bg-brand-500 text-white': variant === 'primary',
          'bg-gray-700 hover:bg-gray-600 text-gray-100': variant === 'secondary',
          'bg-red-500 text-white': variant === 'danger',
          'bg-transparent text-gray-900 dark:text-white': variant === 'transparent',
        },
      )}
      {...props}
    />
  );
}
