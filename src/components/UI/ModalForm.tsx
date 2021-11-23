import { XIcon } from '@heroicons/react/outline';
import { ReactNode, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from './Button';
import { Form } from './Form';

export interface Props<T> {
  title: string;
  description?: string;
  submitText?: string | React.ReactNode;
  onSubmit: () => void;
  onClick?: () => void;
  buttonText: string | React.ReactNode;
  buttonClassName?: string;
  buttonSquare?: boolean;
  children: ReactNode;
  form: UseFormReturn<T>;
}

/**
 * Custom ModalForm component. Containing a custom Form component, a cancel button and a submit button
 * This Modal component contains its state itself (unlike the ManagedModal)
 * @param title bigger text at the top
 * @param onClick a function which gets called when the modal open button gets clicked
 * @param buttonText the text of the button which will be show if the modal is hidden
 * @param buttonSquare button is shown in a square, mainly used for icons
 * @param submitText the text shown on the submit button inside the modal
 * @param children should contain all the custom Input components inside the form
 * @param form an instance of a react-hook-form which will contain the state of the whole form
 */
export function ModalForm<T>({
  title,
  onSubmit,
  onClick = () => {},
  buttonText = false,
  buttonSquare,
  submitText = buttonText,
  buttonClassName,
  children,
  form,
  description,
}: Props<T>) {
  const [showModal, setShowModal] = useState(false);

  const onSubmitHandler = () => {
    onSubmit();
    form.reset();
    setShowModal(false);
  };

  const onCloseHandler = () => {
    form.reset();
    setShowModal(false);
  };

  return (
    <>
      <Button
        className={buttonClassName}
        onClick={() => {
          onClick();
          setShowModal(true);
        }}
        square={buttonSquare}
      >
        {buttonText}
      </Button>
      {showModal && (
        <>
          <div className="text-left justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm md:max-w-lg z-40">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>
                {/*body*/}
                {description && (
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3>{description}</h3>
                  </div>
                )}
                <Form form={form} onSubmit={onSubmitHandler}>
                  <div className="relative p-6 flex-auto">{children}</div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <Button
                      type="reset"
                      className="mr-4"
                      variant="secondary"
                      onClick={onCloseHandler}
                    >
                      <XIcon className="w-6 h-6" />
                    </Button>
                    <Button type="submit">{submitText}</Button>
                  </div>
                </Form>
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
