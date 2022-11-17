import React from 'react';

interface IToggleProps {
  on: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const Toggle: React.FC<IToggleProps> = ({
  on,
  onClick,
  children,
  ...props
}) => {
  return (
    <div onClick={onClick} className="inline-flex items-center justify-start">
      <input
        type="checkbox"
        checked={on}
        className="hidden"
        onChange={() => {}}
      />
      <div
        className={`inline-block w-[70px] h-[42px] relative cursor-pointer rounded-full p-1 transition-all ${
          on ? 'bg-green-500' : 'bg-gray-300'
        }`}
        {...props}
      >
        <span
          className={`transition-all w-[34px] h-[34px] bg-white rounded-full inline-block ${
            on ? 'translate-x-[28px]' : ''
          }`}
        ></span>
      </div>
      <span className="ml-3 font-medium">{children}</span>
    </div>
  );
};

export default Toggle;
