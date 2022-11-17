import React, { FC } from 'react';

interface IFieldProps {
  children?: React.ReactNode;
  className?: string;
}

const Field: FC<IFieldProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col items-start mb-6 gap-y-[10px] ${className}`}>
      {children}
    </div>
  );
};

export default Field;
