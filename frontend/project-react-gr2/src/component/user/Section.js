import React from 'react';

const Section = ({
  title,
  children,
  className = "",
  titleClassName = "",
  contentClassName = "",
  containerClassName = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
}) => {
  return (
    <section className={`py-8 lg:py-12 ${className}`}>
      <div className={containerClassName}>
        {title && (
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 lg:mb-12 ${titleClassName}`}>
            {title}
          </h2>
        )}
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;