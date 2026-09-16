import React from 'react';

export const Badge = ({ status }) => {
  const getStatusStyles = (statusText) => {
    const s = (statusText || '').toLowerCase();
    switch (s) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'under review':
      case 'under_review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'harvested':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'claim filed':
      case 'claim_filed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};
