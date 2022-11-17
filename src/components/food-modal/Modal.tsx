import React from 'react';
import ReactDOM from 'react-dom';

interface IModalProps {
  children?: React.ReactNode;
  handleClose?: () => void;
}

const Modal: React.FC<IModalProps> = ({ children, handleClose = () => {} }) => {
  if (typeof document === 'undefined') {
    return <div className="modal"></div>;
  } else {
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center modal">
        <div className="absolute inset-0 bg-black bg-opacity-50 overlay"></div>
        <div className="relative z-10 w-full p-10 bg-white rounded-lg modal-content max-w-[1000px]">
          <span
            className="absolute top-0 right-0 inline-flex items-center justify-center w-10 h-10 text-lg font-medium text-black bg-white border rounded-full cursor-pointer -translate-y-1/3 translate-x-1/3"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
          {children}
        </div>
      </div>,
      (document as any).querySelector('body')
    );
  }
};

export default Modal;
