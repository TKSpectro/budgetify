import clsx from 'clsx';
import { ComponentProps, forwardRef, ReactNode } from 'react';
import { InputError } from './Form';

interface Props extends ComponentProps<'input'> {
  label: string;
  className?: string;
  icon?: ReactNode;
}

/**
 * Custom Input component. Should be used inside the custom Form component
 */
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, type = 'text', className, icon, ...props },
  ref,
) {
  return (
    <label className={className}>
      <div className="py-1 px-2 text-md font-semibold ">{label}</div>

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 pl-2 left-0 flex items-center pointer-events-none">
            {icon}

            <div className="ml-1.5 w-[1px] h-full bg-gray-800"></div>
          </div>
        )}

        <input
          className={clsx(
            'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md py-2 border focus:border-brand-500 focus:ring-brand-500',
            icon && 'pl-12 pr-4 ',
            !icon && 'px-4',
          )}
          type={type}
          ref={ref}
          {...props}
        />
      </div>

      <InputError name={props.name} />
    </label>
  );
});
