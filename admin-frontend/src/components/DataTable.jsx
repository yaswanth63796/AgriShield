import React from 'react';

export const DataTable = ({ columns, rows, emptyMessage = "No records found" }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows && rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
