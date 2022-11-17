import React, { FC } from 'react';

interface IErrorMessageProps {
  children?: string;
}

const ErrorMessage: FC<IErrorMessageProps> = ({ children }) => {
  return <div className="text-red-400">*{children}</div>;
};

export default ErrorMessage;
