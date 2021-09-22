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
  children: ReactNode;
  form: UseFormReturn<T>;
}

export function ModalForm<T>({
  title,
  onSubmit,
  onClick = () => {},
  buttonText,
  submitText = buttonText,
  buttonClassName,
  children,
  form,
  description,
  ...props
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
      >
        {buttonText}
      </Button>
      {showModal && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-sm md:max-w-lg">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-900 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{title}</h3>
                </div>
                {/*body*/}
                {description && (
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="">{description}</h3>
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
                      Close
                    </Button>
                    <Button type="submit">{submitText}</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
