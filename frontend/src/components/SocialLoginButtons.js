import React from 'react';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import Button from './Button';

const SocialLoginButtons = ({
  onGoogleLogin,
  onFacebookLogin,
  onGithubLogin,
  disabled = false,
  className = '',
  buttonClassName = '',
}) => {
  const socialProviders = [
    {
      name: 'Google',
      icon: <FaGoogle className="h-4 w-4" />,
      onClick: onGoogleLogin,
      color: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="h-4 w-4" />,
      onClick: onFacebookLogin,
      color: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
    {
      name: 'GitHub',
      icon: <FaGithub className="h-4 w-4" />,
      onClick: onGithubLogin,
      color: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {socialProviders.map((provider) => (
        provider.onClick && (
          <Button
            key={provider.name}
            type="button"
            onClick={provider.onClick}
            disabled={disabled}
            className={`
              w-full justify-center ${provider.color}
              ${buttonClassName}
            `}
            leftIcon={provider.icon}
          >
            Đăng nhập với {provider.name}
          </Button>
        )
      ))}
    </div>
  );
};

export default React.memo(SocialLoginButtons);