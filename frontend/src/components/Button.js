import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  loadingText = 'Đang xử lý...',
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500
      disabled:bg-blue-400
    `,
    secondary: `
      bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500
      disabled:bg-gray-400
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700 focus:ring-green-500
      disabled:bg-green-400
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      disabled:bg-red-400
    `,
    warning: `
      bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500
      disabled:bg-yellow-400
    `,
    outline: `
      bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500
      disabled:bg-gray-50 disabled:text-gray-400
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500
      disabled:text-gray-400
    `,
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.medium}
    ${className}
  `;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin h-4 w-4 mr-2" />}
      {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
      {loading ? loadingText : children}
      {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default React.memo(Button);