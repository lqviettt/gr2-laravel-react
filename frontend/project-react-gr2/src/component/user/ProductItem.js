import { memo } from "react";

const ProductItem = ({ product, formatCurrency }) => {
  return (
    <a
      href={`/product-detail/${product.id}`}
      className="flex flex-col items-center no-underline bg-gray-50 border border-gray-300 rounded-lg p-2 sm:p-4 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      {product.image && (
        <img
          src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}`}
          alt={product.name}
          className="w-full sm:w-4/5 h-auto mb-2.5"
        />
      )}
      <div className="text-left text-lg sm:text-xl font-semibold w-full sm:w-4/5">
        <p className="text-sm sm:text-base font-medium text-gray-800">{product.name}</p>
        <p className="mt-3 sm:mt-5 text-red-500 text-sm sm:text-base">
          {formatCurrency(product.price * 1000)}
        </p>
      </div>
    </a>
  );
};

export default memo(ProductItem);