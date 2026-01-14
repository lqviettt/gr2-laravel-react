import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({
  size = 'medium',
  color = 'blue',
  className = '',
  text,
  overlay = false,
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin ${sizeClasses[size] || sizeClasses.medium} ${colorClasses[color] || colorClasses.blue}`} />
      {text && (
        <p className={`mt-2 text-sm ${colorClasses[color] || colorClasses.blue}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default React.memo(LoadingSpinner);