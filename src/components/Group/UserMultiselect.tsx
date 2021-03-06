import { forwardRef, useEffect, useState } from 'react';
import { User } from '~/graphql/__generated__/types';
import { UserDropdown } from './UserDropdown';

// https://dev.to/hunterjsbit/build-multiselect-component-in-react-in-few-lines-4m1c
// But with some changes

interface Props {
  items: User[];
  setValue: (member: User[]) => void;
}

export const UserMultiSelect = forwardRef<HTMLFormControlsCollection, Props>(
  function UserMultiSelect({ items, setValue }: Props, ref) {
    // state showing if dropdown is open or closed
    const [dropdown, setDropdown] = useState(false);
    // contains selected items
    const [selectedItems, setSelected] = useState(items);

    const toggleDropdown = () => {
      setDropdown(!dropdown);
    };

    const toggleItem = (item: User) => {
      if (selectedItems.some((value) => value.id === item.id)) {
        setSelected(selectedItems.filter((oldItem) => oldItem.id != item.id));
      } else {
        setSelected(selectedItems.concat(item));
      }
    };

    useEffect(() => {
      setValue(selectedItems);
    }, [selectedItems, setValue]);

    return (
      <div className="autcomplete-wrapper">
        <div className="autcomplete">
          <div className="w-full flex flex-col items-center mx-auto">
            <div className="w-full">
              <div className="flex flex-col items-center relative">
                <div className="w-full ">
                  <div className="my-2 p-1 flex border border-gray-200 dark:border-gray-400 bg-white dark:bg-gray-900 rounded ">
                    <div className="flex flex-auto flex-wrap">
                      {selectedItems.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex justify-center items-center m-1 font-semibold py-1 px-2 bg-white dark:bg-gray-800 rounded-full  border "
                          >
                            <div className="text-xs font-normal leading-none max-w-full flex-initial dark:text-brand-400">
                              {item.name}
                            </div>
                            <div className="flex flex-auto flex-row-reverse">
                              <div onClick={() => toggleItem(item)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="feather feather-x cursor-pointer hover:text-teal-400 rounded-full w-4 h-4 ml-2"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex-1">
                        <input
                          placeholder=""
                          disabled
                          className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                        />
                      </div>
                    </div>
                    <div
                      className="text-gray-300 flex border-l border-gray-200 dark:border-gray-400"
                      onClick={toggleDropdown}
                    >
                      <div className="cursor-pointer w-6 h-6 ml-1 place-self-center text-gray-600 dark:text-gray-300 outline-none focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {dropdown ? (
                <UserDropdown
                  items={items.filter((element) => !selectedItems.includes(element))}
                  toggleItem={toggleItem}
                ></UserDropdown>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
