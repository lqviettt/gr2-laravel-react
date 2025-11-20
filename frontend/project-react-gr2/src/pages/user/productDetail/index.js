import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import { GiCheckMark } from "react-icons/gi";
import { IoBookmarksOutline } from "react-icons/io5";
import { TiFlashOutline } from "react-icons/ti";
import { toast } from "react-toastify";

import { useCart } from "../../../component/CartContext";
import { getProductImage, formatCurrency } from "../../../utils/common";
import { LoadingSpinner, ErrorMessage, Section } from "../../../component/user";
import { api } from "../../../utils/apiClient";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productByCategory, setProductByCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleClick = (productId) => {
    setSelectedProductId(productId);
    navigate(`/product-detail/${productId}`);
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedVariant,
      quantity,
    };
    addToCart(cartItem);
    toast.success("Cập nhật giỏ hàng thành công!");
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        const result = response.data;
        if (result?.data) {
          setProduct(result.data);
          setSelectedVariant(result.data.variants[0]);
          setCategoryId(result.data.category_id);
          const categoryName = result.data.category?.name || "";
          const images = getProductImage(categoryName) || [];
          if (result.data.image) {
            setSelectedImage(
              `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${result.data.image}`
            );
          } else if (result.data.variants && result.data.variants.length > 0 && result.data.variants[0].image) {
            setSelectedImage(
              `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${result.data.variants[0].image}`
            );
          } else if (images.length > 0) {
            setSelectedImage(images[0].src);
          }
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi gọi API:", err);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    const fetchProductByCategory = async () => {
      if (!categoryId) return;
      try {
        const response = await api.get(`/product?category_id=${categoryId}`);
        const result = response.data;
        setProductByCategory(result.data);
      } catch (error) {
        console.error(
          "Error fetching product by category:",
          error.response?.data || error.message
        );
      }
    };

    fetchProductByCategory();
  }, [categoryId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Section>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">
            {product.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Product Image Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <img
                  src={
                    selectedImage ||
                    (product.image
                      ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}`
                      : (getProductImage(product.category?.name) || [])[0]?.src || "")
                  }
                  alt="Ảnh sản phẩm lớn"
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-lg"
                />

                <div className="product-thumbnails flex gap-2 mt-4 overflow-x-auto pb-2">
                  {/* Render thumbnails from product.image and product variants */}
                  {([
                    ...(product.image
                      ? [{ id: 'main', src: `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}`, alt: product.name }]
                      : []),
                    ...product.variants
                      .filter((variant) => variant.image)
                      .map((variant) => ({
                        id: variant.id,
                        src: `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${variant.image}`,
                        alt: variant.value,
                      })),
                  ]).map((image) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setSelectedImage(image.src);
                        const matchingVariant = product.variants.find(v => v.value === image.alt);
                        if (matchingVariant) {
                          setSelectedVariant(matchingVariant);
                        }
                      }}
                      className={`w-20 h-20 rounded-md border-2 flex-shrink-0 p-1 ${
                        selectedImage === image.src ? "border-blue-500" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || product.name}
                        className="w-full h-full object-contain rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
                  Loại: <span className="text-blue-600">{product.category?.name || "Không có"}</span>
                </div>

                <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
                  Giá bán: <br />
                  <span className="text-red-500">
                    {selectedVariant?.price ? formatCurrency(selectedVariant.price * 1000) : "Liên hệ"}
                  </span>
                </div>

                {/* Product Variants by Category */}
                {Array.isArray(productByCategory) && productByCategory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Chọn dung lượng:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {productByCategory.map((productItem) => {
                        const storage = productItem.name.split(" ").pop();
                        const isSelected = productItem.id === selectedProductId;

                        return (
                          <button
                            key={productItem.id}
                            onClick={() => handleClick(productItem.id)}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-blue-300"
                            }`}
                          >
                            <h4 className="font-semibold text-sm sm:text-base">{storage}</h4>
                            <p className="text-xs sm:text-sm font-semibold text-red-600 mt-1">
                              {productItem.price
                                ? formatCurrency(productItem.price * 1000)
                                : "Liên hệ"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Màu sắc:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`px-3 py-2 rounded-lg border text-sm sm:text-base transition-colors ${
                          selectedVariant?.id === variant.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-blue-300"
                        }`}
                        onClick={() => {
                          setSelectedVariant(variant);
                          const imageSrc = variant.image
                            ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${variant.image}`
                            : product.image
                            ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}`
                            : selectedImage;
                          setSelectedImage(imageSrc);
                        }}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Số lượng:</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <span className="text-gray-600 font-bold">-</span>
                    </button>
                    <span className="w-16 text-center font-semibold text-lg border border-gray-300 rounded-lg py-2">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <span className="text-gray-600 font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Tình trạng:</h3>
                  <span className="text-blue-600 font-medium">Máy LikeNew 99%</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>

              {/* Warranty and Status Info */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <h2 className="flex bg-blue-600 p-4 text-white text-lg font-semibold">
                    <IoBookmarksOutline size={24} className="mr-3" />
                    Cam kết bán hàng
                  </h2>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Bảo hành 12 tháng lỗi 1 đổi 1</span>
                      </li>
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Lên đời thu 100% giá web</span>
                      </li>
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Bảo hành rơi vỡ vào nước sửa chữa miễn phí không giới hạn</span>
                      </li>
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Tặng kèm cáp sạc nhanh zin + Cường lực full màn</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <h2 className="flex bg-blue-600 p-4 text-white text-lg font-semibold">
                    <TiFlashOutline size={24} className="mr-2" />
                    Tình trạng máy
                  </h2>
                  <div className="p-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Máy 98% là các máy cấn móp, xước sâu nhiều</span>
                      </li>
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Máy 99% là các máy gần như mới, có vài vết xước nhẹ nhỏ</span>
                      </li>
                      <li className="flex items-start">
                        <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Máy New 100% là các máy mới chưa Active (không box)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default memo(ProductDetail);
