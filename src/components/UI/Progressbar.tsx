import clsx from 'clsx';

export interface Props {
  text: String;
  type: String;
  progress: Number;
  value?: String;
  reverse?: Boolean;
  barHidden?: Boolean;
}

// https://www.creative-tim.com/learning-lab/tailwind/nextjs/progressbars/notus
// Good implementation of a progressbar with some minor changes
export function Progressbar({
  text,
  type,
  progress = 0,
  value,
  reverse,
  barHidden = false,
}: Props) {
  return (
    <>
      <div className="flex mb-2 items-center justify-between">
        <div className="text-xs font-semibold uppercase text-brand-600 dark:text-brand-200">
          <span className="inline-block py-1 px-2 rounded-full bg-brand-200 dark:bg-brand-700">
            {text}
          </span>
          <span className="inline-block py-1 px-2 ml-2 rounded-full bg-brand-200 dark:bg-brand-700">
            {type}
          </span>
          {value && (
            <span className="inline-block py-1 px-2 ml-2 rounded-full bg-brand-200 dark:bg-brand-700">
              {value}
            </span>
          )}
        </div>
        {!barHidden && (
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-brand-600 dark:text-brand-300">
              {progress}%
            </span>
          </div>
        )}{' '}
      </div>
      {!barHidden && (
        <div className="overflow-hidden h-2 text-xs flex rounded bg-brand-200 dark:bg-brand-700">
          <div
            // Need to set width per style because if we would set it in className the tailwindJIT
            // Compiler would not know that he need to generate w-progress at the moment of creation
            style={{ width: progress.toString() + '%' }}
            className={clsx(
              'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-500 dark:bg-brand-400',
              reverse && 'ml-auto',
            )}
          ></div>
        </div>
      )}
    </>
  );
}
