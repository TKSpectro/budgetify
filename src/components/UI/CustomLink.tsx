import Link from 'next/link';
import { ComponentProps } from 'react';

export interface LinkProps extends ComponentProps<'a'> {}

export function CustomLink({ href, ...props }: LinkProps) {
  const content = (
    <a
      className="text-gray-900 dark:text-gray-100 underline font-medium  hover:text-opacity-80"
      {...props}
    />
  );

  return <Link href={href!}>{content}</Link>;
}
