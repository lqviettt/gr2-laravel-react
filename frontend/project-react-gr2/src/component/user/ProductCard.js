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
  // Ưu tiên image từ API, nếu không có thì dùng mock image
  let imageUrl = null;
  
  if (product.image) {
    imageUrl = `${process.env.REACT_APP_LARAVEL_APP}/storage/${product.image}`;
  } else {
    const mockImages = getProductImage(product.category_id);
    if (mockImages && mockImages.length > 0) {
      imageUrl = mockImages[0].src;
    }
  }

  return (
    <div className={`group ${className}`}>
      <a
        href={`/product-detail/${product.id}`}
        className="block transition-transform duration-200 hover:scale-105"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className={`w-full h-auto object-contain rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200 ${imageClassName}`}
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
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