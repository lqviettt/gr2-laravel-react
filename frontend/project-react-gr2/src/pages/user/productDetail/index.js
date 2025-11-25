import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import { GiCheckMark } from "react-icons/gi";
import { IoBookmarksOutline } from "react-icons/io5";
import { TiFlashOutline } from "react-icons/ti";
import { MdLocalShipping, MdAssignment } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";

import { useCart } from "../../../component/CartContext";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";
import { getProductImage, formatCurrency } from "../../../utils/common";
import { LoadingSpinner, ErrorMessage, Section } from "../../../component/user";
import { api } from "../../../utils/apiClient";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { addToCart, setBuyNowItem } = useCart();
  const { setBreadcrumbTrail } = useBreadcrumb();
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

  const handleBuyNow = () => {
    const cartItem = {
      ...product,
      selectedVariant,
      quantity,
    };
    
    setBuyNowItem(cartItem);
    navigate("/checkout");
  };

  const getProductPrice = () => {
    if (selectedVariant?.price) {
      return formatCurrency(selectedVariant.price * 1000);
    }
    if (product?.price) {
      return formatCurrency(product.price * 1000);
    }
    return "Liên hệ";
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProductDetail = async () => {
      try {
        const response = await api.get(`/product/${id}`);
        
        if (!isMounted) return;
        
        const result = response.data;
        if (result?.data) {
          setProduct(result.data);
          setSelectedProductId(result.data.id);
          setSelectedVariant(result.data.variants && result.data.variants.length > 0 ? result.data.variants[0] : null);
          setCategoryId(result.data.category_id);
          
          // Fetch full category hierarchy for breadcrumb
          if (result.data.category_id) {
            try {
              let trail = [];
              let currentCatId = result.data.category_id;
              let depth = 0;
              
              while (currentCatId && depth < 10) {
                try {
                  const catResponse = await api.get(`/category/${currentCatId}`);
                  const category = catResponse.data?.data;
                  if (!category) break;
                  
                  let path = `/product?category_id=${category.id}`;
                  trail.unshift({ name: category.name, path, clickable: true });
                  currentCatId = category.parent_id;
                  depth++;
                } catch (err) {
                  break;
                }
              }
              
              // Add product name at the end (not clickable)
              trail.push({ name: result.data.name, path: `/product-detail/${id}`, clickable: false });
              
              if (trail.length > 0) {
                setBreadcrumbTrail(trail);
              }
            } catch (error) {
            }
          }
          
          const categoryNameForImage = result.data.category?.name || "";
          const images = getProductImage(categoryNameForImage) || [];
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
        if (!isMounted) return;
        setError(err.message);
      }
    };

    if (id) {
      fetchProductDetail();
    }
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchProductByCategory = async () => {
      if (!categoryId) return;
      try {
        const response = await api.get(`/product?category_id=${categoryId}&perPage=6`);
        
        if (!isMounted) return;
        
        const result = response.data;
        // API trả về dạng pagination {data: [...], current_page, ...}
        const products = result.data?.data || result.data || [];
        setProductByCategory(products);
      } catch (error) {
        if (!isMounted) return;
        setProductByCategory([]);
      }
    };

    fetchProductByCategory();
    
    return () => {
      isMounted = false;
    };
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
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-between gap-2 py-4 px-3 sm:p-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-gray-600 truncate">{product.name}</p>
              <p className="text-lg sm:text-xl font-bold text-red-600">
                {getProductPrice()}
              </p>
            </div>
          </div>
          
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors shadow-md"
            onClick={handleBuyNow}
          >
            🛍️ Mua ngay
          </button>

          <button
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors shadow-md"
            onClick={handleAddToCart}
            title="Giỏ hàng"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>

      <Section className="py-2 lg:py-6 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 lg:mb-8">
            {product.name}
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Product Image Section */}
            <div className="col-span-1 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <img
                  src={
                    selectedImage ||
                    (product.image
                      ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}`
                      : (getProductImage(product.category?.name) || [])[0]?.src || "")
                  }
                  alt="Ảnh sản phẩm lớn"
                  className="w-full max-w-xs mx-auto rounded-lg shadow-lg bg-gray-100 object-contain"
                />

                <div className="product-thumbnails flex gap-4 mt-12 overflow-x-auto pb-2">
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
                      className={`w-16 h-16 rounded-md border-2 flex-shrink-0 p-1 ${
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

                {/* Product Description */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-3">Mô tả sản phẩm</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description || "Không có mô tả sản phẩm"}
                  </p>
                </div>
              </div>
              {/* Warranty and Status Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h2 className="flex bg-blue-600 p-4 text-white text-lg font-bold">
                      <IoBookmarksOutline size={24} className="mr-3" />
                      Cam kết bán hàng
                    </h2>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Bảo hành 12 tháng lỗi 1 đổi 1</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Lên đời thu 100% giá web</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Bảo hành rơi vỡ vào nước sửa chữa miễn phí không giới hạn</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Tặng kèm cáp sạc nhanh zin + Cường lực full màn</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h2 className="flex bg-blue-600 p-4 text-white text-lg font-bold">
                      <TiFlashOutline size={24} className="mr-2" />
                      Tình trạng máy
                    </h2>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Máy 98% là các máy cấn móp, xước sâu nhiều</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Máy 99% là các máy gần như mới, có vài vết xước nhẹ nhỏ</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Máy New 100% là các máy mới chưa Active (không box)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h2 className="flex bg-blue-600 p-4 text-white text-lg font-bold">
                      <MdLocalShipping size={24} className="mr-2" />
                      Hình thức giao hàng
                    </h2>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Giao hàng toàn quốc nhanh chóng</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Đóng gói an toàn, bảo vệ sản phẩm tối đa</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm sm:text-base">Hỗ trợ 24/7 trong quá trình vận chuyển</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h2 className="flex bg-blue-600 p-4 text-white text-lg font-semibold">
                      <MdAssignment size={24} className="mr-2" />
                      Chính sách đổi trả
                    </h2>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Đổi trả miễn phí trong 3 ngày</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Sản phẩm phải còn nguyên vẹn, không có vết xước</span>
                        </li>
                        <li className="flex items-start">
                          <GiCheckMark size={16} className="mr-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">Không bao gồm các phụ kiện tặng kèm</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="col-span-1 lg:col-span-2 space-y-4 lg:space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4">
                  Loại: <span className="text-blue-600">{product.category?.name || "Không có"}</span>
                </div>

                <div className="text-lg sm:text-xl font-bold mb-2">
                  Giá bán:
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                  <span className="text-red-500">
                    {getProductPrice()}
                  </span>
                </div>

                {/* Product Variants by Category */}
                {productByCategory && Array.isArray(productByCategory) && productByCategory.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Phiên bản khác</h3>
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
                                : productItem.variants && productItem.variants.length > 0
                                ? formatCurrency(productItem.variants[0].price * 1000)
                                : "Liên hệ"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
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
                )}

                {/* Quantity Selector */}
                <div className="mb-6 pb-6">
                  <h3 className="text-lg font-semibold mb-3">Số lượng</h3>
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

                {/* Add to Cart Button */}
                <div className="space-y-3 mb-4">
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-bold text-lg sm:text-xl transition-colors shadow-md hover:shadow-lg"
                    onClick={handleBuyNow}
                  >
                    🛍️ Mua ngay
                  </button>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-base sm:text-lg transition-colors shadow-sm hover:shadow-md"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
              {/* Payment Offers */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
                  <h2 className="flex bg-green-600 p-4 text-white text-xl font-bold">
                    <FaCreditCard size={24} className="mr-3" />
                    Ưu đãi thanh toán
                  </h2>
                  <div className="p-4">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">
                        Xem chính sách ưu đãi dành cho thành viên Smember
                      </p>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span><strong>Kredivo</strong> - Giảm đến 5.000.000đ khi thanh toán qua Kredivo</span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Hoàn tiền đến 2 triệu khi mở thẻ tín dụng <strong>HSBC</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Mở thẻ <strong>VIB</strong> nhận E-Voucher đến 600K</span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Giảm 500K khi thanh toán bằng thẻ tín dụng <strong>HDBank</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Trả góp 0 lãi, phí + tặng 500k khi mở thẻ <strong>TPBANK EVO</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Giảm 400K khi thanh toán bằng thẻ tín dụng <strong>Home Credit</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Giảm đến 300K khi thanh toán qua <strong>VNPAY-QR</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Giảm 2% tối đa 200K khi thanh toán qua <strong>MOMO</strong></span>
                      </li>
                      <li className="flex items-start text-sm sm:text-base">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span>Liên hệ <strong>B2B</strong> để được tư vấn giá tốt nhất cho khách hàng doanh nghiệp khi mua số lượng nhiều</span>
                      </li>
                    </ul>
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
