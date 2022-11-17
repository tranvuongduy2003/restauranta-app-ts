import React from 'react';

interface IPaginationProps {
  currentPage: number;
  lastPage: number;
  increase: () => void;
  decrease: () => void;
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  lastPage,
  increase,
  decrease,
}) => {
  return (
    <div className="flex items-center justify-center mt-5 text-lg font-medium text-gray-600 gap-x-10">
      <div
        className={`cursor-pointer  ${
          currentPage === 1
            ? 'text-gray-200 cursor-default'
            : 'hover:text-primary'
        }`}
        onClick={decrease}
      >
        Trước
      </div>
      <div
        className={`cursor-pointer  ${
          currentPage === lastPage
            ? 'text-gray-200 cursor-default'
            : 'hover:text-primary'
        }`}
        onClick={increase}
      >
        Sau
      </div>
    </div>
  );
};

export default Pagination;
