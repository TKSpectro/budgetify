import { XIcon } from '@heroicons/react/outline';
import { Button, Props as ButtonProps } from './Button';

export interface Props extends ButtonProps {
  title: string;
  description?: string;
  submitText: string | React.ReactNode;
  onSubmit: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

/**
 * Custom ManagedModal component. Containing texts, a cancel button and a submit button
 * This component does NOT contain its state itself (unlike the normal Modal component)
 * It can be used for tables where all rows for example should open the same modal.
 * @param title bigger text at the top
 * @param description main content show in the middle
 * @param submitText the text shown on the submit button inside the modal
 * @param showModal the state (boolean) if the modal should be shown
 * @param setShowModal a function changing the state of showing the modal
 */
export function ManagedModal({
  title,
  description,
  submitText,
  onSubmit,
  showModal,
  setShowModal,
}: Props) {
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm z-40">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>
                {/*body*/}
                {description && (
                  <p className="m-4 text-blueGray-500 text-lg leading-relaxed">{description}</p>
                )}
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
              className="opacity-50 fixed inset-0 z-30 bg-black"
              onClick={() => setShowModal(false)}
            ></div>
          </div>
        </>
      ) : null}
    </>
  );
}
