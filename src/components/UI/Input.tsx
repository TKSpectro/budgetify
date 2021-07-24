import { ComponentProps, forwardRef } from 'react';

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
        className="bg-white text-gray-800 w-full rounded-md px-4 py-2 border"
        type={type}
        ref={ref}
        {...props}
      />

      {/* TODO: Add Field Errors -> needs to be handled through the form?!} */}
      {/* {errors.firstname && <span>Firstname-Error</span>} */}
    </label>
  );
});
