import React from 'react';

const InfoCard = ({
  title,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  icon,
  action,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || icon || action) && (
        <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center">
            {icon && <span className="mr-3 text-gray-500">{icon}</span>}
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(InfoCard);