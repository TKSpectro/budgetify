import { ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  text: string;
  overflowText?: string;
  showOpen: boolean;
  children: React.ReactNode;
}

export function Disclosure({ text, overflowText, showOpen, children, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {text}
      {showOpen && (
        <>
          <span className="float-right pr-4">
            <ChevronDownIcon className="w-5 h-5" />
          </span>
        </>
      )}
      <div className={clsx('mx-4', { hidden: !isOpen })}>{children}</div>
    </div>
  );
}
