import React from 'react';
import { useDropdown } from './dropdown-context';

export interface IOptionProps {
  onClick?: () => void;
  children?: React.ReactNode;
}

const Option: React.FC<IOptionProps> = ({ onClick, children }) => {
  const { setShow } = useDropdown();
  const handleClick = () => {
    onClick && onClick();
    setShow && setShow(false);
  };
  return (
    <div
      className="flex items-center justify-between py-[15px] px-[25px] transition-all cursor-pointer hover:text-primary"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default Option;
