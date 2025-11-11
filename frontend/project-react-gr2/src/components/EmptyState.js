import React from 'react';
import { FaInbox, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const EmptyState = ({
  icon: Icon = FaInbox,
  title = 'Không có dữ liệu',
  description = 'Không tìm thấy dữ liệu nào phù hợp.',
  action,
  className = '',
  iconClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  actionClassName = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className={`mb-4 ${iconClassName}`}>
        <Icon className="h-12 w-12 text-gray-400" />
      </div>

      <h3 className={`text-lg font-medium text-gray-900 mb-2 ${titleClassName}`}>
        {title}
      </h3>

      <p className={`text-gray-500 mb-6 max-w-sm ${descriptionClassName}`}>
        {description}
      </p>

      {action && (
        <div className={actionClassName}>
          {action}
        </div>
      )}
    </div>
  );
};

// Predefined empty states for common scenarios
export const NoData = (props) => (
  <EmptyState
    icon={FaInbox}
    title="Không có dữ liệu"
    description="Không tìm thấy dữ liệu nào."
    {...props}
  />
);

export const NoSearchResults = (props) => (
  <EmptyState
    icon={FaSearch}
    title="Không tìm thấy kết quả"
    description="Không có kết quả nào phù hợp với tìm kiếm của bạn."
    {...props}
  />
);

export const ErrorState = (props) => (
  <EmptyState
    icon={FaExclamationTriangle}
    title="Đã xảy ra lỗi"
    description="Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại."
    {...props}
  />
);

export default React.memo(EmptyState);