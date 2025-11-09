import React from 'react';

const ErrorMessage = ({ title = "Lỗi tải dữ liệu", message, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;