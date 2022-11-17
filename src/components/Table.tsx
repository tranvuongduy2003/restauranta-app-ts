import React from 'react';

interface ITableProps {
  children: React.ReactNode;
}

const Table: React.FC<ITableProps> = ({ children }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-[10px] border border-[#f7f7f8]">
      <table>{children}</table>
    </div>
  );
};

export default Table;
