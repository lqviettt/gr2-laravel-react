import React from 'react';
import { FaUser } from 'react-icons/fa';

const UserAvatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'medium',
  className = '',
  showInitials = true,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    small: 'h-8 w-8 text-sm',
    medium: 'h-12 w-12 text-base',
    large: 'h-16 w-16 text-lg',
    xl: 'h-20 w-20 text-xl',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover rounded-full"
          onError={handleImageError}
        />
      );
    }

    if (showInitials && name) {
      return (
        <span className="font-medium text-gray-600">
          {getInitials(name)}
        </span>
      );
    }

    return <FaUser className="text-gray-400" />;
  };

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full bg-gray-200
        ${sizeClasses[size] || sizeClasses.medium}
        ${className}
      `}
      {...props}
    >
      {renderContent()}
    </div>
  );
};

export default React.memo(UserAvatar);