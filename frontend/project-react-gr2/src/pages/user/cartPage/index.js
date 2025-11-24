import { useEffect } from "react";
import { useCart } from "../../../component/CartContext";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";
import { BsMinecartLoaded } from "react-icons/bs";
import Section from "../../../component/user/Section";
import { formatCurrency } from "../../../utils/common";
import "./stylecart.scss";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();
  const { setBreadcrumbTrail } = useBreadcrumb();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setBreadcrumbTrail([
        { name: "Giỏ hàng", path: "/cart" },
      ]);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        (item.selectedVariant ? item.selectedVariant.price : item.price) *
        item.quantity,
      0
    );
  };

  const handleQuantityChange = (itemId, variantId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, variantId, newQuantity);
  };

  const handleRemoveFromCart = (item) => {
    return () => {
      removeFromCart(
        item.id,
        item.selectedVariant
          ? item.selectedVariant.id
          : null
      );
      toast.success("Cập nhật giỏ hàng thành công!");
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <Section>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 lg:py-16">
                <BsMinecartLoaded size={64} className="text-gray-400 mb-6" />
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-600 text-center">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-gray-500 mt-2 text-center">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
                </p>
                <button
                  onClick={() => window.location.href = "/"}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                  Giỏ hàng của bạn ({cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm)
                </h2>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                          Sản phẩm
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 w-32">
                          Số lượng
                        </th>
                        <th className="text-right py-4 px-4 text-sm font-semibold text-gray-600 w-32">
                          Đơn giá
                        </th>
                        <th className="text-center py-4 px-4 text-sm font-semibold text-gray-600 w-20">
                          Xóa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 flex-shrink-0">
                                {item.category?.name && (
                                  <img
                                    src={
                                      item.selectedVariant?.image
                                        ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${item.selectedVariant.image}`
                                        : item.image
                                        ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${item.image}`
                                        : "/placeholder-image.jpg"
                                    }
                                    alt={item.name}
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                                  {item.name}
                                </h3>
                                {item.selectedVariant && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {item.selectedVariant.value}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.selectedVariant?.id || null,
                                    item.quantity - 1
                                  )
                                }
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                              >
                                <span className="text-gray-600 font-bold">-</span>
                              </button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.selectedVariant?.id || null,
                                    item.quantity + 1
                                  )
                                }
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                              >
                                <span className="text-gray-600 font-bold">+</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <span className="text-lg font-semibold text-blue-600">
                              {formatCurrency(
                                (item.selectedVariant?.price || item.price) * item.quantity * 1000
                              )}
                            </span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <button
                              onClick={handleRemoveFromCart(item)}
                              className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group"
                            >
                              <svg
                                className="w-4 h-4 text-red-500 group-hover:text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={
                              item.selectedVariant?.image
                                ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${item.selectedVariant.image}`
                                : item.image
                                ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${item.image}`
                                : "/placeholder-image.jpg"
                            }
                            alt={item.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.selectedVariant && (
                            <p className="text-sm text-gray-600 mb-2">
                              {item.selectedVariant.value}
                            </p>
                          )}
                          <p className="text-blue-600 font-semibold text-lg">
                            {formatCurrency(
                              (item.selectedVariant?.price || item.price) * item.quantity * 1000
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedVariant?.id || null,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <span className="text-gray-600 font-bold">-</span>
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedVariant?.id || null,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                          >
                            <span className="text-gray-600 font-bold">+</span>
                          </button>
                        </div>

                        <button
                          onClick={handleRemoveFromCart(item)}
                          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className="text-sm font-medium">Xóa</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="text-center lg:text-left">
                  <p className="text-sm text-gray-600 mb-1">Tổng cộng</p>
                  <p className="text-2xl lg:text-3xl font-bold text-blue-600">
                    {formatCurrency(getTotalPrice() * 1000)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Tiếp tục mua sắm
                  </button>
                  <button
                    onClick={() => window.location.href = "/checkout"}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold shadow-sm hover:shadow-md"
                  >
                    Thanh toán ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default Cart;
