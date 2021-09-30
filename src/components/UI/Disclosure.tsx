import { ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  text: string;
  overflowText?: string;
  showOpen: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Disclosure({ text, overflowText, showOpen, className, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={'hover:cursor-pointer ' + className} onClick={() => setIsOpen(!isOpen)}>
        {text}
        {overflowText && (
          <>
            <span className="float-right hidden sm:inline sm:max-w-[16rem] truncate pr-5">
              {overflowText}
            </span>
            <div className="mx-4 block sm:hidden sm:max-w-[16rem] truncate pr-5">
              {overflowText}
            </div>
          </>
        )}
        {showOpen && (
          <span className="float-right pr-4">
            <ChevronDownIcon className="w-6 h-6" />
          </span>
        )}
      </div>
      <div className={clsx('my-2 mx-4', { hidden: !isOpen || overflowText })}>{children}</div>
    </>
  );
}
