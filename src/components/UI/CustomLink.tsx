import clsx from 'clsx';
import Link from 'next/link';
import { ComponentProps } from 'react';

export interface LinkProps extends ComponentProps<'a'> {
  noUnderline?: boolean;
}

export function CustomLink({ noUnderline = false, href, ...props }: LinkProps) {
  const content = (
    <a
      className={clsx(
        'text-gray-900 dark:text-gray-100 underline font-medium  hover:text-opacity-80',
        { 'no-underline': noUnderline },
      )}
      {...props}
    />
  );

  return <Link href={href!}>{content}</Link>;
}
