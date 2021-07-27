import { ComponentProps, forwardRef } from 'react';
import { InputError } from './Form';

interface Props extends ComponentProps<'input'> {
  label: string;
  type: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, type, ...props },
  ref,
) {
  return (
    <label>
      <div>{label}</div>
      <input
        //className="bg-white text-gray-800 w-full rounded-md px-4 py-2 border-none   focus:outline-none"
        className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full rounded-md px-4 py-2 border focus:border-brand-500 focus:ring-brand-500"
        type={type}
        ref={ref}
        {...props}
      />

      <InputError name={props.name} />
    </label>
  );
});
