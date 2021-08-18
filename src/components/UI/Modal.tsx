import { useState } from 'react';
import { Button } from './Button';

export interface ModalProps {
  title: string;
  description: string;
  submitText?: string;
  onSubmit?: any;
  buttonText: string;
  color: 'brand' | 'red';
}

export function Modal({
  title,
  description,
  submitText = 'SAVE CHANGES',
  buttonText,
  color,
  ...props
}: ModalProps) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className={`bg-${color}-500 text-white active:bg-${color}-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
        type="button"
        onClick={() => setShowModal(true)}
      >
        {buttonText}
      </button>
      {showModal ? (
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
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">{description}</p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <Button variant="transparent" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      props.onSubmit();
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
      ) : null}
    </>
  );
}
