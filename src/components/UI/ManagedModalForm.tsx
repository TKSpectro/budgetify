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
              className="opacity-50 fixed inset-0 z-30 bg-black"
              onClick={() => setShowModal(false)}
            ></div>
          </div>
        </>
      ) : null}
    </>
  );
}
