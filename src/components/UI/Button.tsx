import clsx from 'clsx';
import { ComponentProps } from 'react';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  isSubmit?: true | false;
}

// TODO: Handle submit

export function Button({ variant = 'primary', isSubmit = false, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'flex items-center justify-center px-4 py-2 rounded font-medium hover:bg-opacity-90',
        {
          'bg-brand-500 text-white': variant === 'primary',
          'bg-gray-700 hover:bg-gray-600 text-gray-100': variant === 'secondary',
          'bg-red-500 text-white': variant === 'danger',
        },
      )}
      {...props}
    />
  );
}
