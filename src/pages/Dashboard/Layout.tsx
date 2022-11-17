import React from 'react';
import Sidebar from 'modules/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import DashboardHeader from 'modules/header/DashboardHeader';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-[1600px] my-0 mx-auto">
      <DashboardHeader></DashboardHeader>
      <div className="grid items-start px-5 py-10 grid-cols-sidebar gap-x-10 gap-y-0">
        <Sidebar></Sidebar>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
