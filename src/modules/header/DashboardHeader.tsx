import Button from 'components/Button';
import React from 'react';
import { NavLink } from 'react-router-dom';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between gap-5 p-5 bg-white border-b border-gray-300">
      <NavLink to="/" className="flex items-center gap-5 text-lg font-semibold">
        <img
          srcSet="/logo/main-logo.png"
          alt="monkey-blogging"
          className="w-12 h-12"
        />
        <span className="inline-block">Restaurant Management</span>
      </NavLink>
      <div>
        <Button to="/" className="w-auto" type="button">
          Tạo món ăn mới
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
