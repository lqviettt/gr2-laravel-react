import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  columns = { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  className = "",
  itemClassName = ""
}) => {
  const gridClasses = `grid gap-3 sm:gap-4 lg:gap-6 grid-cols-${columns.default} ${
    columns.sm ? `sm:grid-cols-${columns.sm}` : ''
  } ${
    columns.md ? `md:grid-cols-${columns.md}` : ''
  } ${
    columns.lg ? `lg:grid-cols-${columns.lg}` : ''
  } ${
    columns.xl ? `xl:grid-cols-${columns.xl}` : ''
  }`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className={itemClassName}
        />
      ))}
    </div>
  );
};

export default ProductGrid;