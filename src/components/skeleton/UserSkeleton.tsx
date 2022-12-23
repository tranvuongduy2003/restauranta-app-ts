import React from 'react';

const UserSkeleton: React.FC = () => {
  return (
    <tr>
      <td className="w-[282px]">
        <div className="w-full h-[20px] bg-slate-200 animate-pulse"></div>
      </td>
      <td>
        <div className="flex items-center gap-x-3">
          <div className="w-[66px] h-[55px] bg-slate-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="w-full h-5 mb-2 bg-slate-200 animate-pulse"></div>
            <div className="w-full h-4 bg-slate-200 animate-pulse"></div>
          </div>
        </div>
      </td>
      <td>
        <div className="h-[16.7px] w-full bg-slate-200 animate-pulse"></div>
      </td>
      <td>
        <div className="h-[16.7px] w-full bg-slate-200 animate-pulse"></div>
      </td>
      <td>
        <div className="flex items-center gap-x-3">
          <span className="flex items-center justify-center w-10 h-10 rounded cursor-pointer bg-slate-200 animate-pulse"></span>
          <span className="flex items-center justify-center w-10 h-10 rounded cursor-pointer bg-slate-200 animate-pulse"></span>
          <span className="flex items-center justify-center w-10 h-10 rounded cursor-pointer bg-slate-200 animate-pulse"></span>
        </div>
      </td>
    </tr>
  );
};

export default UserSkeleton;
