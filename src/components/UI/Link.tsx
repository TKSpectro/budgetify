import clsx from 'clsx';
import { default as NextLink } from 'next/link';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'a'> {
  noUnderline?: boolean;
  asButton?: boolean;
  href: string;
}

export function Link({ noUnderline = false, asButton = false, href, ...props }: Props) {
  const content = (
    <a
      className={clsx(
        'text-gray-900 dark:text-gray-100 underline font-medium  hover:text-opacity-80',
        { 'no-underline': noUnderline },
        { 'bg-brand-500 items-center justify-center px-6 py-3 rounded no-underline': asButton },
      )}
      {...props}
    />
  );

  return <NextLink href={href!}>{content}</NextLink>;
}