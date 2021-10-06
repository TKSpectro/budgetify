import { ComponentProps, forwardRef, ReactNode } from 'react';
import { InputError } from './Form';

interface Props extends ComponentProps<'select'> {
  label: string;
  children: ReactNode;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Input(
  { label, children, className, ...props },
  ref,
) {
  return (
    <label className={className}>
      <div className="py-1 px-2 text-md font-semibold ">{label}</div>
      <select
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
        ref={ref}
        {...props}
      >
        {children}
      </select>

      <InputError name={props.name} />
    </label>
  );
});
