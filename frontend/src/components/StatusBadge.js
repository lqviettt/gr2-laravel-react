import React from 'react';

const StatusBadge = ({
  status,
  variant = 'default',
  size = 'medium',
  className = '',
  children,
}) => {
  // Define status configurations
  const statusConfigs = {
    // Order statuses
    pending: { label: 'Chờ xử lý', color: 'yellow' },
    shipping: { label: 'Đang giao hàng', color: 'blue' },
    delivered: { label: 'Đã giao hàng', color: 'green' },
    cancelled: { label: 'Đã hủy', color: 'red' },

    // Payment statuses
    unpaid: { label: 'Chưa thanh toán', color: 'red' },
    paid: { label: 'Đã thanh toán', color: 'green' },
    failed: { label: 'Thanh toán thất bại', color: 'red' },

    // General statuses
    active: { label: 'Hoạt động', color: 'green' },
    inactive: { label: 'Không hoạt động', color: 'gray' },
    draft: { label: 'Bản nháp', color: 'gray' },
    published: { label: 'Đã xuất bản', color: 'green' },
  };

  const config = statusConfigs[status] || { label: status, color: 'gray' };
  const label = children || config.label;

  const colorClasses = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
    },
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };

  const classes = `
    inline-flex items-center font-medium rounded-full border
    ${colorClasses[config.color]?.bg || colorClasses.gray.bg}
    ${colorClasses[config.color]?.text || colorClasses.gray.text}
    ${colorClasses[config.color]?.border || colorClasses.gray.border}
    ${sizeClasses[size] || sizeClasses.medium}
    ${className}
  `;

  return (
    <span className={classes}>
      {label}
    </span>
  );
};

export default React.memo(StatusBadge);