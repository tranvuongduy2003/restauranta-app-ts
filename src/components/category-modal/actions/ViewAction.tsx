import React, { Fragment, useState } from 'react';
import Modal from 'components/food-modal/Modal';
import ViewModal from 'components/category-modal/ViewModal';
import { ICategory } from 'utils/interface';

interface IViewActionProps {
  item: ICategory;
}

const ViewAction: React.FC<IViewActionProps> = ({ item }) => {
  const [show, setShow] = useState(false);
  return (
    <Fragment>
      {show && (
        <Modal handleClose={() => setShow(false)}>
          <ViewModal item={item}></ViewModal>
        </Modal>
      )}
      <span
        className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded cursor-pointer"
        onClick={() => setShow(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </span>
    </Fragment>
  );
};

export default ViewAction;
