import clsx from 'clsx';
import { ComponentProps } from 'react';

export interface Props extends ComponentProps<'button'> {
  square?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'transparent';
  className?: string;
}

/**
 * Custom Button component which wraps a button element
 * @param square changes the look to a square, mainly used for icons
 * @param variant changes the look of the button (primary, secondary, danger, transparent)
 * @param className extends the styling of the component
 */
export function Button({ square = false, variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'items-center justify-center rounded font-medium hover:bg-opacity-90 disabled:cursor-not-allowed' +
          (className ? ' ' + className : ''),
        {
          'px-6 py-2': !square,
          'px-2 py-2': square,
          'bg-brand-500 text-white': variant === 'primary',
          'bg-gray-700 hover:bg-gray-600 text-gray-100': variant === 'secondary',
          'bg-red-500 text-white': variant === 'danger',
          'border-2 border-gray-700 bg-transparent text-gray-900 dark:text-white':
            variant === 'transparent',
        },
      )}
      {...props}
    />
  );
}
