import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Sprout, FileWarning, Shield, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockClaims } from '../data/claims';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const pendingClaimsCount = mockClaims.filter((c) => c.status === 'Pending').length;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Farmers',
      path: '/farmers',
      icon: Users,
    },
    {
      label: 'Registered crops',
      path: '/registered-crops',
      icon: Sprout,
    },
    {
      label: 'Claim crops',
      path: '/claims',
      icon: FileWarning,
      badge: pendingClaimsCount,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Top Brand Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#DCFCE7] text-[#15803D] rounded-lg">
            <Shield className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">AgroShield</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#DCFCE7] text-[#15803D] border-l-4 border-[#15803D] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-[#DC2626] rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile & Sign Out */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || 'Priya Raman'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
