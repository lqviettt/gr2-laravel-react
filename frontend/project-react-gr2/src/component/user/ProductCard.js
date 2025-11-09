import React from 'react';
import { formatCurrency, getProductImage } from '../../utils/common';

const ProductCard = ({
  product,
  className = "",
  showPrice = true,
  imageClassName = "",
  titleClassName = "",
  priceClassName = ""
}) => {
  const images = getProductImage(product.category_id);

  return (
    <div className={`group ${className}`}>
      <a
        href={`/product-detail/${product.id}`}
        className="block transition-transform duration-200 hover:scale-105"
      >
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={image.alt}
            className={`w-full h-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200 ${imageClassName}`}
          />
        ))}
        <div className={`mt-3 ${titleClassName}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {showPrice && (
            <p className={`mt-2 text-red-500 font-medium ${priceClassName}`}>
              {formatCurrency(product.price * 1000)}
            </p>
          )}
        </div>
      </a>
    </div>
  );
};

export default ProductCard;