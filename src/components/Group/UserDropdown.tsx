// https://dev.to/hunterjsbit/build-multiselect-component-in-react-in-few-lines-4m1c
// But with some changes

import { User } from '~/graphql/__generated__/types';

interface Props {
  items: User[];
  toggleItem: (item: User) => void;
}

export function UserDropdown({ items, toggleItem }: Props) {
  return (
    <div
      id="dropdown"
      className="absolute shadow top-100 bg-white dark:bg-gray-800 z-40 w-full md:max-w-md lef-0 rounded max-h-select overflow-y-auto "
    >
      <div className="flex flex-col w-full">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
              onClick={() => toggleItem(item)}
            >
              <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                <div className="w-full items-center flex">
                  <div className="mx-2 leading-6  ">{item.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
