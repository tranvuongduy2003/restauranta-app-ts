import React, { useState } from 'react';

interface ICheckboxProps {
  checked: boolean;
  onClick: () => void;
}

const Checkbox: React.FunctionComponent<ICheckboxProps> = ({
  checked,
  onClick,
}) => {
  return (
    <div
      className={`inline-block rounded-md cursor-pointer border-2 ${
        checked ? 'bg-primary border-primary' : 'border-grayLight'
      } transition-all`}
      onClick={onClick}
    >
      <div className="text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default Checkbox;
