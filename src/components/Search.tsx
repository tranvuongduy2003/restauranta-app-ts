import React from 'react';
import lodash from 'lodash';

interface ISearchProps {
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  name: React.InputHTMLAttributes<HTMLInputElement>['name'];
  placeholder?: string;
  hasIcon?: boolean;
  handleInputChange?: any;
}

const Input: React.FC<ISearchProps> = ({
  type = 'text',
  name,
  placeholder,
  hasIcon = false,
  handleInputChange = () => {},
  ...props
}) => {
  return (
    <div className="relative w-full">
      <input
        onChange={lodash.debounce(
          (e: React.ChangeEvent<HTMLInputElement>) =>
            handleInputChange((e.target as any).value),
          500
        )}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`w-full ${
          hasIcon ? 'p-[15px_60px_15px_25px]' : 'p-[15px_25px]'
        } border border-grayf1 rounded-lg font-normal transition-all text-black focus:border-primary`}
        {...props}
      />
    </div>
  );
};

export default Input;
