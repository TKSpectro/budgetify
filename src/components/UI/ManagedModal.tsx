import { Button, Props as ButtonProps } from './Button';

export interface Props extends ButtonProps {
  title: string;
  description?: string;
  submitText: string | React.ReactNode;
  onSubmit: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

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
                {description && (
                  <p className="m-4 text-blueGray-500 text-lg leading-relaxed">{description}</p>
                )}
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <Button className="mr-4" variant="secondary" onClick={() => setShowModal(false)}>
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
      ) : null}
    </>
  );
}
