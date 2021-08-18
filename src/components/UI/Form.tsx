import { ComponentProps } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';

interface InputErrorProps {
  name?: string;
}

export function InputError({ name }: InputErrorProps) {
  const {
    formState: { errors },
  } = useFormContext();
  if (!name) return null;

  const error = errors[name];
  if (!error) return null;

  return <div className="text-sm text-red-500 font-bold">{error.message}</div>;
}

interface Props<T extends FieldValues = any> extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function Form({ form, onSubmit, children, ...props }: Props) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset className="flex flex-col space-y-3">{children}</fieldset>
      </form>
    </FormProvider>
  );
}
