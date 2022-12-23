import React, { Fragment, useState } from 'react';
import Modal from 'components/modal/Modal';
import EditModal from 'components/user-modal/EditModal';
import { useNavigate } from 'react-router-dom';
import { IUser } from 'utils/interface';

interface IUpdateActionProps {
  item: IUser;
}

const UpdateAction: React.FC<IUpdateActionProps> = ({ item }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <Fragment>
      {show && (
        <Modal handleClose={() => setShow(false)}>
          <EditModal
            handleClose={() => {
              setShow(false);
              navigate(0);
            }}
            item={item}
          ></EditModal>
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </span>
    </Fragment>
  );
};

export default UpdateAction;
