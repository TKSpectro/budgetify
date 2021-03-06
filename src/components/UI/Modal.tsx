import { XIcon } from '@heroicons/react/outline';
import { ReactNode, useState } from 'react';
import { Button, Props as ButtonProps } from './Button';

export interface Props extends ButtonProps {
  title: string;
  description?: string;
  onSubmit: () => void;
  buttonText: string | React.ReactNode;
  buttonClassName?: string;
  submitText?: string | React.ReactNode;
  children?: ReactNode;
}

/**
 * Custom Modal component. Containing texts, a cancel button and a submit button
 * This Modal component contains its state itself (unlike the ManagedModal)
 * @param title bigger text at the top
 * @param description main content show in the middle
 * @param buttonText the text of the button which will be show if the modal is hidden
 * @param submitText the text shown on the submit button inside the modal
 * @param children can contain any ReactNodes which get placed below the description
 */
export function Modal({
  title,
  description,
  onSubmit,
  buttonText,
  buttonClassName,
  variant,
  submitText = buttonText,
  children,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button className={buttonClassName} variant={variant} onClick={() => setShowModal(true)}>
        {buttonText}
      </Button>
      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm z-40 sm:min-w-[26rem]">
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
                  <Button className="mr-4" variant="secondary" onClick={() => setShowModal(false)}>
                    <XIcon className="w-6 h-6" />
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
            <div
              className="opacity-80 fixed inset-0 z-30 bg-black"
              onClick={() => setShowModal(false)}
            ></div>
          </div>
        </>
      )}
    </>
  );
}
