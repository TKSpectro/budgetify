import clsx from 'clsx';
import { default as NextLink } from 'next/link';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'a'> {
  noUnderline?: boolean;
  asButton?: boolean;
  href: string;
}

/**
 * Custom Link component which wraps a next/link
 * @param noUnderline will remove the underline styling from the text
 * @param asButton will style the link like a button
 * @param href the location where the link should redirect to
 * @returns
 */
export function Link({ noUnderline = false, asButton = false, href, ...props }: Props) {
  const content = (
    <a
      className={clsx(
        'font-medium  hover:bg-opacity-90',
        { 'no-underline': noUnderline },
        {
          'text-white bg-brand-500 items-center justify-center px-6 py-2 rounded no-underline':
            asButton,
        },
        { 'text-gray-900 dark:text-gray-100 underline': !asButton },
      )}
      {...props}
    />
  );

  return <NextLink href={href!}>{content}</NextLink>;
}
