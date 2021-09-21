import { ReactNode, useState } from 'react';
import { Button, Props as ButtonProps } from './Button';

export interface Props extends ButtonProps {
  title: string;
  description?: string;
  onSubmit: () => void;
  buttonText: string;
  buttonClassName?: string;
  submitText?: string | React.ReactNode;
  children?: ReactNode;
}

export function Modal({
  title,
  description,
  onSubmit,
  buttonText,
  buttonClassName,
  variant,
  submitText = buttonText,
  children,
  ...props
}: Props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button className={buttonClassName} variant={variant} onClick={() => setShowModal(true)}>
        {buttonText}
      </Button>
      {showModal && (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            // onClick={() => setShowModal(false)}
          >
            <div className="relative w-auto my-6 mx-auto max-w-sm">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {description && (
                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">{description}</p>
                  )}
                  {children}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <Button variant="transparent" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      onSubmit();
                    }}
                  >
                    {submitText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
