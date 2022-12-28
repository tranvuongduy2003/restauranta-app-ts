import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

type ITextAreaProps = {
  height?: string;
  name: React.TextareaHTMLAttributes<HTMLTextAreaElement>['name'];
  placeholder?: string;
  children?: React.ReactNode;
  control?: any;
} & UseControllerProps;

const TextArea: React.FC<ITextAreaProps> = ({
  height,
  name,
  placeholder,
  children,
  control,
  ...props
}) => {
  const { field } = useController({ control, name, defaultValue: '' });
  return (
    <textarea
      {...field}
      id={name}
      placeholder={placeholder}
      className={`w-full min-h-[${height}] h-[${height}] p-[15px_25px] border border-grayf1 rounded-lg font-normal transition-all text-black resize-none`}
      {...props}
    >
      {children}
    </textarea>
  );
};

export default TextArea;
