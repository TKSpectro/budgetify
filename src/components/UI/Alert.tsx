import clsx from 'clsx';
import { useState } from 'react';

interface AlertProps {
  message: string;
  type?: 'warning' | 'error';
}

export function Alert({ message, type, ...props }: AlertProps) {
  const [showAlert, setShowAlert] = useState(true);
  return (
    <>
      {showAlert && (
        <div
          className={clsx(
            'text-gray-800 dark:text-white px-6 py-4 border-0 rounded relative mb-4 ',
            {
              'bg-gray-200 dark:bg-gray-700': !type,
              'bg-yellow-500': type === 'warning',
              'bg-red-500': type === 'error',
            },
          )}
        >
          <div className="inline-block align-middle mr-6">{message}</div>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none"
            onClick={() => setShowAlert(false)}
          >
            <span>×</span>
          </button>
        </div>
      )}
    </>
  );
}
