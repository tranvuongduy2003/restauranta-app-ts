import React, { Fragment } from 'react';
import { useDropdown } from './dropdown-context';

export interface IListProps {
  children?: React.ReactNode;
}

const List: React.FC<IListProps> = ({ children }) => {
  const { show } = useDropdown();
  return (
    <Fragment>
      {show && (
        <div className="absolute left-0 z-50 w-full bg-white rounded-b-lg shadow-sm top-full">
          {children}
        </div>
      )}
    </Fragment>
  );
};

export default List;
