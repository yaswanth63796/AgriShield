import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Derive page title from current route path
  const getPageTitle = (path) => {
    if (path.startsWith('/farmers')) return 'Farmers';
    if (path.startsWith('/registered-crops/')) return 'Crop Details';
    if (path.startsWith('/registered-crops')) return 'Registered crops';
    if (path.startsWith('/claims')) return 'Claim crops';
    return 'Dashboard';
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Topbar
          pageTitle={title}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
