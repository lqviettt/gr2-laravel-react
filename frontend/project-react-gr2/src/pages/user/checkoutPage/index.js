import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../component/CartContext";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";
import { BsMinecartLoaded } from "react-icons/bs";
import { GiCheckMark } from "react-icons/gi";
import axios from "axios";
import ghn from "../../../assets/images/ghn.png";
import ghtk from "../../../assets/images/ghtk.png";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { setBreadcrumbTrail } = useBreadcrumb();
  const { cartItems, getTotalPrice, removeAllFromCart, buyNowItems, clearBuyNowItems, getTotalPriceForItems } = useCart();
  
  // Sử dụng buyNowItems nếu có (khi bấm Mua ngay), nếu không dùng cartItems
  const itemsToCheckout = buyNowItems || cartItems;
  
  // Tính tổng giá cho items được checkout
  const getTotalCheckoutPrice = () => {
    return getTotalPriceForItems(itemsToCheckout);
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setBreadcrumbTrail([
        { name: "Giỏ hàng", path: "/cart" },
        { name: "Thanh toán", path: "/checkout" },
      ]);
    }

    return () => {
      isMounted = false;
    };
  }, []);
  
  const [selectedFee, setSelectedFee] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingUnits, setShippingUnits] = useState([]);
  const sortedProvinces = provinces.sort((a, b) => a.ProvinceID - b.ProvinceID);

  const paymentMethods = [
    { id: "COD", label: "Thanh toán khi nhận hàng" },
    { id: "VNBANK", label: "Thanh toán qua thẻ ATM" },
    { id: "INTCARD", label: "Thanh toán qua thẻ Visa/MasterCard" },
    { id: "VNPAYQR", label: "Thanh toán bằng QR Code" },
  ];

  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  const handleShippingUnitChange = (key, fee) => {
    setSelectedFee(fee);
    setOrder({
      ...order,
      shipping_fee: fee,
      total_price: getTotalCheckoutPrice() * 1000 + fee,
    });
    document.getElementById(key).click();
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setOrder({
      ...order,
      payment_method: method,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };

  const handleConfirm = () => {
    setOrderSuccess(false);
    removeAllFromCart();
    clearBuyNowItems();
    setBreadcrumbTrail([]);
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const [order, setOrder] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    status: "pending",
    shipping_province: "",
    shipping_district: "",
    shipping_ward: "",
    shipping_address_detail: "",
    shipping_fee: "",
    total_price: "",
    payment_method: "",
    order_item: itemsToCheckout.map((item) => ({
      product_id: item.id,
      product_variant_id: item.selectedVariant ? item.selectedVariant.id : "",
      quantity: item.quantity,
      price: item.price,
    })),
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            headers: {
              Token: "a19da9e8-ad5e-11ef-ba4c-42a0500c1482",
            },
          }
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!order.shipping_province_id) return;
      try {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${order.shipping_province_id}`,
          {
            headers: {
              Token: "a19da9e8-ad5e-11ef-ba4c-42a0500c1482",
            },
          }
        );
        setDistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [order.shipping_province_id]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!order.shipping_district_id) return;
      try {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${order.shipping_district_id}`,
          {
            headers: {
              Token: "a19da9e8-ad5e-11ef-ba4c-42a0500c1482",
            },
          }
        );
        setWards(response.data.data);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };

    fetchWards();
  }, [order.shipping_district_id]);

  const calculateShippingFee = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/shipping-fee`,
        {
          service_type_id: 2,
          province: order.shipping_province,
          district: order.shipping_district,
          ward: order.shipping_ward,
          address: order.shipping_address_detail,
          weight: 300,
          value: getTotalCheckoutPrice(),
        }
      );
      setShippingUnits(response.data);
    } catch (error) {
      console.error(
        "Error calculating shipping fee:",
        error.response?.data || error.message
      );
    }
  }, [order.shipping_province, order.shipping_district, order.shipping_ward, order.shipping_address_detail, getTotalPrice]);

  useEffect(() => {
    if (
      order.shipping_province &&
      order.shipping_district &&
      order.shipping_ward
    ) {
      calculateShippingFee();
    }
  }, [order.shipping_province, order.shipping_district, order.shipping_ward, calculateShippingFee]);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Thông tin đơn hàng gửi đi", order);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order`,
        order,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      setOrder({ ...order, ...response.data.data });

      console.log("Đơn hàng đã được tạo:", response.data.data);

      if (
        response.data.data.payment &&
        response.data.data.payment.payment_url
      ) {
        console.log("Chuyển hướng đến payment URL");
        window.location.href = response.data.data.payment.payment_url;
      } else {
        console.log("Không có payment_url, đơn hàng thành công");
        setOrderSuccess(true);
        toast.success("Đơn hàng đã được tạo thành công!");
      }
    } catch (error) {
      console.error(
        "Error create order:",
        error.response?.data || error.message
      );
      toast.error("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <form className="" onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                {/* Order Information */}
                <div className="flex-1 order-1 xl:order-1">
                  <h2 className="border-l-[5px] pl-3 border-blue-500 text-xl sm:text-2xl font-bold text-gray-800 mb-6 lg:mb-8">
                    Thông tin đặt hàng
                  </h2>

                  {/* Customer Information */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">
                      Thông tin người nhận
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <input
                          type="text"
                          name="customer_name"
                          placeholder="Họ và tên"
                          value={order.customer_name}
                          onChange={handleChange}
                          required
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="customer_phone"
                          placeholder="Số điện thoại"
                          value={order.customer_phone}
                          onChange={handleChange}
                          required
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="email"
                          name="customer_email"
                          placeholder="Email"
                          value={order.customer_email}
                          onChange={handleChange}
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">
                      Địa chỉ nhận hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      <div>
                        <select
                          name="shipping_province"
                          value={`${order.shipping_province},${order.shipping_province_id}`}
                          required
                          onChange={(e) => {
                            const [provinceName, provinceID] =
                              e.target.value.split(",");
                            setOrder({
                              ...order,
                              shipping_province: provinceName,
                              shipping_province_id: provinceID,
                            });
                          }}
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {sortedProvinces.map((province) => (
                            <option
                              key={province.ProvinceID}
                              value={`${province.ProvinceName},${province.ProvinceID}`}
                              className="bg-white"
                            >
                              {province.ProvinceName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <select
                          name="shipping_district"
                          value={`${order.shipping_district},${order.shipping_district_id}`}
                          required
                          onChange={(e) => {
                            const [districtName, districtID] =
                              e.target.value.split(",");
                            setOrder({
                              ...order,
                              shipping_district: districtName,
                              shipping_district_id: districtID,
                            });
                          }}
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((district) => (
                            <option
                              key={district.DistrictID}
                              value={`${district.DistrictName},${district.DistrictID}`}
                            >
                              {district.DistrictName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <select
                          name="shipping_ward"
                          value={order.shipping_ward}
                          onChange={handleChange}
                          required
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        >
                          <option value="">Chọn phường/xã</option>
                          {wards.map((ward) => (
                            <option key={ward.WardID} value={ward.WardID}>
                              {ward.WardName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="shipping_address_detail"
                          placeholder="Địa chỉ cụ thể"
                          value={order.shipping_address_detail}
                          onChange={handleChange}
                          className="px-3 lg:px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm lg:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Units */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">
                      Đơn vị vận chuyển
                    </h3>
                    {Object.keys(shippingUnits).length === 0 ? null : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        {["GHTK", "GHN"].map((key) => {
                          const value = shippingUnits[key];
                          let fee = 0;
                          let imageUrl = key === "GHTK" ? ghtk : ghn;
                          let imageSize =
                            key === "GHTK" ? "w-16 h-5 sm:w-18 sm:h-5" : "w-12 h-8 sm:w-14 sm:h-8";

                          if (key === "GHTK" && value.success) {
                            fee = value.fee.options.shipMoney;
                          } else if (key === "GHN" && value.code === 200) {
                            fee = value.data.service_fee;
                          }

                          return (
                            <div
                              key={key}
                              className="flex items-center p-3 lg:p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-200 hover:shadow-md"
                              onClick={() => handleShippingUnitChange(key, fee)}
                            >
                              <input
                                id={key}
                                type="radio"
                                name="shipping_unit"
                                required
                                value={key}
                                className="mr-3"
                              />
                              <img
                                src={imageUrl}
                                alt={key}
                                className={`${imageSize} mr-3 flex-shrink-0`}
                              />
                              <div className="min-w-0 flex-1">
                                <label className="text-sm font-semibold text-gray-800 cursor-pointer block">
                                  {key === "GHTK"
                                    ? "Giao hàng tiết kiệm"
                                    : "GHN - Nhanh"}
                                </label>
                                <p className="text-blue-600 font-medium text-sm lg:text-base">
                                  {formatCurrency(fee)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6 lg:mb-8">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3 lg:mb-4">
                      Phương thức thanh toán
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          className={`w-full py-3 lg:py-4 px-3 lg:px-4 border text-gray-800 text-sm lg:text-base font-semibold rounded-lg flex items-center transition-all duration-200 ${
                            selectedMethod === method.id
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "hover:border-blue-500 hover:shadow-sm"
                          }`}
                          onClick={() => handleSelectMethod(method.id)}
                        >
                          <span className="w-5 h-5 lg:w-6 lg:h-6 flex justify-center items-center mr-3 flex-shrink-0">
                            {selectedMethod === method.id && (
                              <GiCheckMark className="text-blue-600 w-4 h-4" />
                            )}
                          </span>
                          <span className="text-left">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="xl:w-96 order-2 xl:order-2">
                  <div className="bg-gray-50 rounded-lg p-4 lg:p-6 xl:sticky xl:top-4">
                    <h2 className="text-base lg:text-lg border-l-[5px] border-blue-500 pl-3 font-semibold text-gray-800 mb-4 lg:mb-6">
                      Thông tin sản phẩm
                    </h2>

                    {itemsToCheckout.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 lg:py-12">
                        <BsMinecartLoaded size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-600 text-center">
                          Không có sản phẩm nào trong giỏ hàng.
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                        {itemsToCheckout.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg border shadow-sm"
                          >
                            <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                              {item.image && !item.selectedVariant?.image ? (
                                <img
                                  src={`${process.env.REACT_APP_LARAVEL_APP}/storage/${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-contain rounded"
                                />
                              ) : item.selectedVariant?.image ? (
                                <img
                                  src={`${process.env.REACT_APP_LARAVEL_APP}/storage/${item.selectedVariant.image}`}
                                  alt={item.selectedVariant.value}
                                  className="w-full h-full object-contain rounded"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-400">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-800 truncate">
                                {item.name}
                              </h3>
                              <div className="text-xs text-gray-600 mt-1 space-y-1">
                                {item.selectedVariant && (
                                  <p>Màu sắc: {item.selectedVariant.value}</p>
                                )}
                                <p>Số lượng: {item.quantity}</p>
                                <p>Giá: {formatCurrency(item.price * 1000)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4 space-y-2 lg:space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(getTotalCheckoutPrice() * 1000)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Phí vận chuyển:</span>
                        <span>{formatCurrency(selectedFee)}</span>
                      </div>
                      <div className="flex justify-between text-base lg:text-lg font-semibold text-gray-800 border-t border-gray-200 pt-2 lg:pt-3">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">
                          {formatCurrency(getTotalCheckoutPrice() * 1000 + selectedFee)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 text-sm lg:text-base font-medium bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Quay lại giỏ hàng
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 text-sm lg:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                          </>
                        ) : (
                          'Đặt hàng'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
            {/* Success Icon Background */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 px-6 py-8 flex justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-bounce">
                <GiCheckMark className="text-green-500 w-10 h-10" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-8 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                Đặt hàng thành công!
              </h2>
              <p className="text-gray-600 text-sm lg:text-base mb-6">
                Cảm ơn bạn đã lựa chọn chúng tôi. Đơn hàng của bạn đã được tiếp nhận.
              </p>

              {/* Order Info Box */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-600 text-sm mb-1">Mã đơn hàng</p>
                <p className="text-xl lg:text-2xl font-bold text-blue-600">
                  {order.code}
                </p>
              </div>

              {/* Info Items */}
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <GiCheckMark className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Chúng tôi sẽ xác nhận đơn hàng trong 24 giờ
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <GiCheckMark className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Bạn sẽ nhận được email xác nhận tại địa chỉ email đã cung cấp
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <GiCheckMark className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Lưu lại mã đơn hàng và theo dõi đơn hàng của bạn trong "Tra cứu đơn hàng"
                  </span>
                </div>
              </div>

              {/* Button */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                onClick={() => handleConfirm()}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
