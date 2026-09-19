import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/ToastContainer';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <Topbar />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-6 max-w-[1720px] mx-auto">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default AppLayout;
