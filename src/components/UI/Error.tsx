import { ApolloError } from '@apollo/client';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

interface Props {
  title: string;
  error?: Error | string | ApolloError;
  className?: string;
}

/**
 * Custom Error component for handling string errors, Apollo Error thrown by the backend.
 * This automatically tries to i18n the given error, if no translation is found it will just show
 * the given string
 */
export function Error({ title, error, className }: Props) {
  const { t } = useTranslation('common');
  if (typeof error === 'undefined') return null;

  let printableError = '';

  if (typeof error === 'string') {
    printableError = error;
  } else if ('graphQLErrors' in error) {
    // If the error is an ApolloError we can localize the given message, even with given variables
    // which need to be given in the extensions of the error

    error.graphQLErrors.forEach((error, index, array) => {
      // look up message in i18n (should be a number code) and
      // if given use the variables for interpolation in i18n
      printableError += t(error.message, {
        ...error.extensions?.variables,
      });

      array.length > 1 && index !== array.length - 1 ? (printableError += ' --- ') : '';
    });
  } else {
    printableError = error.message;
  }

  return (
    <div
      className={clsx(
        'rounded-md border-2 bg-red-100 border-red-600 border-opacity-60 p-4 my-1 dark:bg-red-400 dark:bg-opacity-5',
        className,
      )}
    >
      <h3 className="text-sm font-medium text-red-700 dark:text-red-500">{title}</h3>
      <div className="text-sm text-red-500 dark:text-red-400">{printableError}</div>
    </div>
  );
}
