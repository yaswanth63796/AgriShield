import React from 'react';
import { Menu, Search } from 'lucide-react';

export const Topbar = ({ pageTitle, onMenuClick, searchTerm, onSearchChange }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {onSearchChange && (
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white"
            />
          </div>
        )}
      </div>
    </header>
  );
};
