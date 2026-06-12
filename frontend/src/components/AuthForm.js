import React from 'react';

const AuthForm = ({
  title,
  subtitle,
  children,
  onSubmit,
  submitButtonText = 'Đăng nhập',
  submitButtonLoading = false,
  footer,
  className = '',
  formClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {/* Header */}
        {(title || subtitle) && (
          <div className={`px-6 pt-6 pb-4 text-center ${headerClassName}`}>
            {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
            {subtitle && <p className="text-gray-600">{subtitle}</p>}
          </div>
        )}

        {/* Form Body */}
        <div className={`px-6 pb-6 ${bodyClassName}`}>
          <form onSubmit={handleSubmit} className={formClassName}>
            {children}
          </form>
        </div>

        {/* Footer */}
        {footer && (
          <div className={`px-6 pb-6 text-center ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AuthForm);