import React, { FC } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

type IInputProps = {
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  hasIcon?: boolean;
} & UseControllerProps;

const Input: FC<IInputProps> = ({
  type = 'text',
  name,
  placeholder,
  hasIcon = false,
  control,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: '',
  });
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        className={`w-full ${
          hasIcon ? 'p-[15px_60px_15px_25px]' : 'p-[15px_25px]'
        } border border-grayf1 rounded-lg font-normal transition-all text-black`}
        {...field}
        {...props}
      />
    </div>
  );
};

export default Input;
