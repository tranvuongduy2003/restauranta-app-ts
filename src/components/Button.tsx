import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';

interface IButtonProps {
  to?: string;
  children?: React.ReactNode;
  type: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  loading?: boolean;
  color?: string;
}

const Button: FC<IButtonProps> = ({
  to,
  children,
  type = 'button',
  className = '',
  loading = false,
  color = '',
}: IButtonProps): any => {
  if (to) {
    return (
      <NavLink
        to={to}
        className={`block overflow-hidden rounded-lg ${className}`}
      >
        <button
          type={type}
          className={`w-[175px] h-[54px] flex justify-center items-center text-white font-medium bg-primary ${
            loading ? 'opacity-75' : 'opacity-100'
          } ${color}`}
        >
          {!loading ? (
            children
          ) : (
            <span className="inline-block border-[3px] border-t-transparent border-white rounded-full w-9 h-9 animate-spin"></span>
          )}
        </button>
      </NavLink>
    );
  } else {
    return (
      <div className={`block overflow-hidden rounded-lg ${className}`}>
        <button
          type={type}
          className={`w-[200px] h-[54px] flex justify-center items-center text-white font-medium bg-primary ${
            loading ? 'opacity-75' : 'opacity-100'
          } ${color}`}
        >
          {!loading ? (
            children
          ) : (
            <span className="inline-block border-[3px] border-t-transparent border-white rounded-full w-9 h-9 animate-spin"></span>
          )}
        </button>
      </div>
    );
  }
};

export default Button;
