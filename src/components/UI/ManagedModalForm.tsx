import { XIcon } from '@heroicons/react/outline';
import { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from './Button';
import { Form } from './Form';

export interface Props<T> {
  title: string;
  description?: string;
  submitText: string | React.ReactNode;
  children: ReactNode;
  form: UseFormReturn<T>;
  onSubmit: () => void;
  onClick?: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

/**
 * Custom ManagedModalForm component. Containing texts, a form, a cancel button and a submit button
 * This component does NOT contain its state itself (unlike the normal ModalForm component)
 * It can be used for tables where all rows for example should open the same modal but with slight
 * differences in the values. This improves performance a lot as the form instance does not need be
 * created for every row of a table. Which would be a huge memory/performance overhead for NEXT
 * @param title bigger text at the top
 * @param description main content show in the middle
 * @param submitText the text shown on the submit button inside the modal
 * @param children should contain all the custom Input components inside the form
 * @param form an instance of a react-hook-form which will contain the state of the whole form
 * @param showModal the state (boolean) if the modal should be shown
 * @param setShowModal a function changing the state of showing the modal
 */
export function ManagedModalForm<T>({
  title,
  description,
  submitText,
  children,
  form,
  onSubmit,
  onClick = () => {},
  showModal,
  setShowModal,
}: Props<T>) {
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
      {showModal ? (
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
      ) : null}
    </>
  );
}
