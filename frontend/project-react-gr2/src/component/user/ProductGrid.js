import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
  products,
  columns = { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  className = "",
  itemClassName = ""
}) => {
  // Static class names - TailwindCSS requires static strings at compile time
  const gridClasses = `grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className={itemClassName}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">Không có sản phẩm nào</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;