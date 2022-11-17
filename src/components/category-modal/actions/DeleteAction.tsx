import React from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import categoryApi from 'api/categoryApi';

interface IDeleteActionProps {
  id?: string;
}

const DeleteAction: React.FC<IDeleteActionProps> = ({ id }) => {
  const navigate = useNavigate();
  const handleDeleteItem = async () => {
    try {
      if (id) {
        await categoryApi.remove(id);
      } else {
        throw new Error('id not found');
      }
      toast.success('Xóa danh mục thành công!');
      navigate(0);
    } catch (error) {
      toast.error('Xóa danh mục thất bại!');
      console.log(error);
    }
  };

  return (
    <span
      className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded cursor-pointer"
      onClick={handleDeleteItem}
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
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </span>
  );
};

export default DeleteAction;
