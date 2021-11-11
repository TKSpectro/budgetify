import clsx from 'clsx';

interface Props {
  isLeft: boolean;
  onClick: () => void;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  big?: boolean;
}

/**
 * Custom switch component
 * @param isLeft the current state of the switch
 * @param onClick a function which gets called when the switch was clicked
 * @param leftIcon a ReactNode which contains the icon which gets shown on the left side
 * @param rightIcon a ReactNode which contains the icon which gets shown on the right side
 * @param big if true will scale the switch up by 14px/1.5rem
 */
export function Switch({ isLeft, onClick, leftIcon, rightIcon, big }: Props) {
  return (
    <div className="items-center" onClick={() => onClick()}>
      <div
        className={clsx(
          'items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out',
          { 'bg-brand-400': isLeft === true },
          { 'w-12 h-6': !big },
          { 'w-16 h-10': big },
        )}
      >
        <div
          className={clsx(
            'bg-white dark:bg-gray-800 rounded-full shadow-md transform duration-300 ease-in-out',
            { 'translate-x-6': isLeft === true },
            { 'w-4 h-4': !big },
            { 'w-8 h-8': big },
          )}
        >
          {isLeft === false ? leftIcon : rightIcon}
        </div>
      </div>
    </div>
  );
}
