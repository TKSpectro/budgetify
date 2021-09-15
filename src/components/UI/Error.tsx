interface Props {
  title: string;
  error?: Error | string;
}

export function Error({ title, error }: Props) {
  if (typeof error === 'undefined') return null;

  return (
    <div className="rounded-md border-2 bg-red-100 border-red-600 border-opacity-60 p-4 my-1 dark:bg-red-400 dark:bg-opacity-5">
      {title && <h3 className="text-sm font-medium text-red-700 dark:text-red-500">{title}</h3>}
      <div className="text-sm text-red-500 dark:text-red-400">
        {typeof error == 'string' ? error : error.message}
      </div>
    </div>
  );
}
