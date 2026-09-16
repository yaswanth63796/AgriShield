import React from 'react';

export const StatCard = ({ icon: Icon, value, label, iconBg = "bg-primary-light", iconColor = "text-primary" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${iconBg} ${iconColor} shrink-0`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900 leading-tight">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};
