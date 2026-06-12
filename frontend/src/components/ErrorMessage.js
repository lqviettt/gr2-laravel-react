import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ErrorMessage = ({
  message,
  title = 'Lỗi',
  onClose,
  className = '',
  dismissible = false,
  variant = 'default', // default, inline, toast
}) => {
  if (!message) return null;

  const baseClasses = 'flex items-start p-4 rounded-md';

  const variantClasses = {
    default: `${baseClasses} bg-red-50 border border-red-200 text-red-800`,
    inline: `${baseClasses} bg-red-50 border-l-4 border-red-400 text-red-700`,
    toast: `${baseClasses} bg-red-100 border border-red-300 text-red-800 shadow-lg`,
  };

  return (
    <div className={`${variantClasses[variant] || variantClasses.default} ${className}`}>
      <FaExclamationTriangle className="flex-shrink-0 h-5 w-5 text-red-400 mt-0.5" />

      <div className="ml-3 flex-1">
        {title && variant !== 'inline' && (
          <h3 className="text-sm font-medium text-red-800 mb-1">
            {title}
          </h3>
        )}
        <p className="text-sm text-red-700">
          {message}
        </p>
      </div>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default React.memo(ErrorMessage);