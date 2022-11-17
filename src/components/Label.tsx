import React from 'react';

interface ILabelProps {
  name?: string;
  children?: React.ReactNode;
}

const Label: React.FC<ILabelProps> = ({ name, children }) => {
  return (
    <label htmlFor={name} className="font-medium cursor-pointer">
      {children}
    </label>
  );
};

export default Label;
