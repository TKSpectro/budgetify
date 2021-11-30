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

/**
 * Custom Disclosure component. Shows a text and if clicked opens up and show the children underneath
 * @param text the base text which always gets shown
 * @param overflowText base text which gets shown at the right side of the disclosure
 * @param showOpen if true shows a arrow which indicates that it can be opened, else this gets hidden and you cant open it
 * @param children ReactNode which contains the elements which can be opened
 */
export function Disclosure({ text, overflowText, showOpen, className, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={clsx('hover:cursor-pointer ', className)} onClick={() => setIsOpen(!isOpen)}>
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
