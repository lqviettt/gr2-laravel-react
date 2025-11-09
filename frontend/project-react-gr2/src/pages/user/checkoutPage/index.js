import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../component/CartContext";
import { BsMinecartLoaded } from "react-icons/bs";
import { GiCheckMark } from "react-icons/gi";
import axios from "axios";
import ghn from "../../../assets/images/ghn.png";
import ghtk from "../../../assets/images/ghtk.png";
import ordersuccess from "../../../assets/images/ordersuccess.png";
import ip12 from "../../../assets/images/ip12.webp";
import ip12Black from "../../../assets/images/ip12-black.webp";
import ip12White from "../../../assets/images/ip12-white.webp";
import ip12Blue from "../../../assets/images/ip12-blue.webp";
import ip12Green from "../../../assets/images/ip12-green.webp";
import ip12Red from "../../../assets/images/ip12do.webp";
import ip12Tim from "../../../assets/images/ip12tim.webp";

import ip12Pro from "../../../assets/images/ip12-pro.webp";
import ip12prden from "../../../assets/images/ip12prden.webp";
import ip12prtrang from "../../../assets/images/ip12prtrang.webp";
import ip1vang from "../../../assets/images/ip12prvang.webp";
import ip12prxanh from "../../../assets/images/ip12prxanh.webp";

import ip13 from "../../../assets/images/ip13.webp";
import ip13do from "../../../assets/images/ip13do.webp";
import ip13den from "../../../assets/images/ip13den.webp";
import ip13hong from "../../../assets/images/ip13hong.webp";
import ip13trang from "../../../assets/images/ip13trang.webp";
import ip13xanhd from "../../../assets/images/ip13xanhd.webp";
import ip13xanhl from "../../../assets/images/ip13xanhl.webp";

import ip13Pro from "../../../assets/images/ip13-pro.webp";
import ip13Proden from "../../../assets/images/ip13prden.webp";
import ip13Provang from "../../../assets/images/ip13prvang.webp";
import ip13Protrang from "../../../assets/images/ip13prtrang.webp";
import ip13Proxanh from "../../../assets/images/ip13prxanh.webp";
import ip13Progreen from "../../../assets/images/ip13prgreen.webp";

import ip14 from "../../../assets/images/ip14.webp";
import ip14den from "../../../assets/images/ip14den.webp";
import ip14trang from "../../../assets/images/ip14trang.webp";
import ip14do from "../../../assets/images/ip14do.webp";
import ip14xanhd from "../../../assets/images/ip14xanhd.webp";
import ip14tim from "../../../assets/images/ip14tim.webp";
import ip14vang from "../../../assets/images/ip14vang.webp";

import ip14Pro from "../../../assets/images/ip14-pro.webp";
import ip14Proden from "../../../assets/images/ip14prden.webp";
import ip14Protrang from "../../../assets/images/ip14prtrang.webp";
import ip14Provang from "../../../assets/images/ip14prvang.webp";
import ip14Protim from "../../../assets/images/ip14prtim.webp";

import ip15 from "../../../assets/images/ip15.webp";
import ip15den from "../../../assets/images/ip15den.webp";
import ip15hong from "../../../assets/images/ip15hong.webp";
import ip15vang from "../../../assets/images/ip15vang.webp";
import ip15xanhd from "../../../assets/images/ip15xanhd.webp";
import ip15xanhl from "../../../assets/images/ip15xanhl.webp";

import ip15Pro from "../../../assets/images/ip15-pro.webp";
import ip15prttd from "../../../assets/images/ip15prttd.webp";
import ip15prttt from "../../../assets/images/ip15prttt.webp";
import ip15prtttn from "../../../assets/images/ip15prtttn.webp";
import ip15prttx from "../../../assets/images/ip15prttx.webp";

import ip16 from "../../../assets/images/ip16.webp";
import ip16den from "../../../assets/images/ip16den.webp";
import ip16trang from "../../../assets/images/ip16trang.webp";
import ip16hong from "../../../assets/images/ip16hong.webp";
import ip16xanh from "../../../assets/images/ip16xanh.webp";
import ip16luuly from "../../../assets/images/ip16luuly.webp";

import ip16Pro from "../../../assets/images/ip16-pro.webp";
import ip16prttd from "../../../assets/images/ip16prttd.webp";
import ip16prttt from "../../../assets/images/ip16prttt.webp";
import ip16prtttn from "../../../assets/images/ip16prtttn.webp";
import ip16prttsm from "../../../assets/images/ip16prttsm.webp";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, removeAllFromCart } = useCart();
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
      total_price: getTotalPrice() * 1000 + fee,
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
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const productImages = {
    "iPhone 12": [
      { id: 1, src: ip12, alt: "iPhone 12" },
      { id: 2, src: ip12Black, alt: "Đen" },
      { id: 3, src: ip12White, alt: "Trắng" },
      { id: 4, src: ip12Red, alt: "Đỏ" },
      { id: 5, src: ip12Tim, alt: "Tím" },
      { id: 6, src: ip12Blue, alt: "Xanh Dương" },
      { id: 7, src: ip12Green, alt: "Xanh Lá" },
    ],
    "iPhone 12 Pro": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro" },
      { id: 2, src: ip12prden, alt: "Đen" },
      { id: 3, src: ip12prtrang, alt: "Trắng" },
      { id: 4, src: ip1vang, alt: "Vàng" },
      { id: 5, src: ip12prxanh, alt: "Xanh" },
    ],
    "iPhone 12 Pro Max": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" },
      { id: 2, src: ip12prden, alt: "Đen" },
      { id: 3, src: ip12prtrang, alt: "Trắng" },
      { id: 4, src: ip1vang, alt: "Vàng" },
      { id: 5, src: ip12prxanh, alt: "Xanh" },
    ],
    "iPhone 13": [
      { id: 1, src: ip13, alt: "iPhone 13" },
      { id: 2, src: ip13do, alt: "Đỏ" },
      { id: 3, src: ip13den, alt: "Đen" },
      { id: 4, src: ip13hong, alt: "Hồng" },
      { id: 5, src: ip13trang, alt: "Trắng" },
      { id: 6, src: ip13xanhd, alt: "Xanh Dương" },
      { id: 7, src: ip13xanhl, alt: "Xanh Lá" },
    ],
    "iPhone 13 Pro": [
      { id: 1, src: ip13Pro, alt: "iPhone 13 Pro" },
      { id: 2, src: ip13Proden, alt: "Đen" },
      { id: 3, src: ip13Protrang, alt: "Trắng" },
      { id: 4, src: ip13Provang, alt: "Vàng" },
      { id: 5, src: ip13Proxanh, alt: "Xanh" },
      { id: 6, src: ip13Progreen, alt: "Xanh Lá" },
    ],
    "iPhone 13 Pro Max": [
      { id: 1, src: ip13Pro, alt: "iPhone 13 Pro Max" },
      { id: 2, src: ip13Proden, alt: "Đen" },
      { id: 3, src: ip13Protrang, alt: "Trắng" },
      { id: 4, src: ip13Provang, alt: "Vàng" },
      { id: 5, src: ip13Proxanh, alt: "Xanh" },
      { id: 6, src: ip13Progreen, alt: "Xanh Lá" },
    ],
    "iPhone 14": [
      { id: 1, src: ip14, alt: "iPhone 14" },
      { id: 2, src: ip14den, alt: "Đen" },
      { id: 3, src: ip14trang, alt: "Trắng" },
      { id: 4, src: ip14do, alt: "Đỏ" },
      { id: 5, src: ip14xanhd, alt: "Xanh Dương" },
      { id: 6, src: ip14tim, alt: "Tím" },
      { id: 7, src: ip14vang, alt: "Vàng" },
    ],
    "iPhone 14 Pro": [
      { id: 1, src: ip14Pro, alt: "iPhone 14 Pro" },
      { id: 2, src: ip14Proden, alt: "Đen" },
      { id: 3, src: ip14Protrang, alt: "Trắng" },
      { id: 4, src: ip14Provang, alt: "Vàng" },
      { id: 5, src: ip14Protim, alt: "Tím" },
    ],
    "iPhone 14 Pro Max": [
      { id: 1, src: ip14Pro, alt: "iPhone 14 Pro Max" },
      { id: 2, src: ip14Proden, alt: "Đen" },
      { id: 3, src: ip14Protrang, alt: "Trắng" },
      { id: 4, src: ip14Provang, alt: "Vàng" },
      { id: 5, src: ip14Protim, alt: "Tím" },
    ],
    "iPhone 15": [
      { id: 1, src: ip15, alt: "iPhone 15" },
      { id: 2, src: ip15den, alt: "Đen" },
      { id: 3, src: ip15hong, alt: "Hồng" },
      { id: 4, src: ip15vang, alt: "Vàng" },
      { id: 5, src: ip15xanhd, alt: "Xanh Dương" },
      { id: 6, src: ip15xanhl, alt: "Xanh Lá" },
    ],
    "iPhone 15 Pro": [
      { id: 1, src: ip15Pro, alt: "iPhone 15 Pro" },
      { id: 2, src: ip15prttd, alt: "Titan Đen" },
      { id: 3, src: ip15prttt, alt: "Titan Trắng" },
      { id: 4, src: ip15prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip15prttx, alt: "Titan Xanh" },
    ],
    "iPhone 15 Pro Max": [
      { id: 1, src: ip15Pro, alt: "iPhone 15 Pro Max" },
      { id: 2, src: ip15prttd, alt: "Titan Đen" },
      { id: 3, src: ip15prttt, alt: "Titan Trắng" },
      { id: 4, src: ip15prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip15prttx, alt: "Titan Xanh" },
    ],
    "iPhone 16": [
      { id: 1, src: ip16, alt: "iPhone 16" },
      { id: 2, src: ip16den, alt: "Đen" },
      { id: 3, src: ip16trang, alt: "Trắng" },
      { id: 4, src: ip16hong, alt: "Hồng" },
      { id: 5, src: ip16xanh, alt: "Xanh Mòng Két" },
      { id: 6, src: ip16luuly, alt: "Xanh Lưu Ly" },
    ],
    "iPhone 16 Pro": [
      { id: 1, src: ip16Pro, alt: "iPhone 16 Pro" },
      { id: 2, src: ip16prttd, alt: "Titan Đen" },
      { id: 3, src: ip16prttt, alt: "Titan Trắng" },
      { id: 4, src: ip16prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip16prttsm, alt: "Titan Sa Mạc" },
    ],
    "iPhone 16 Pro Max": [
      { id: 1, src: ip16Pro, alt: "iPhone 16 Pro Max" },
      { id: 2, src: ip16prttd, alt: "Titan Đen" },
      { id: 3, src: ip16prttt, alt: "Titan Trắng" },
      { id: 4, src: ip16prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip16prttsm, alt: "Titan Sa Mạc" },
    ],
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
    order_item: cartItems.map((item) => ({
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
          value: getTotalPrice(),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Thông tin đơn hàng gửi đi", order);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/order`,
        order
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
                <div className="flex-1 order-2 xl:order-1">
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
                <div className="xl:w-96 order-1 xl:order-2">
                  <div className="bg-gray-50 rounded-lg p-4 lg:p-6 xl:sticky xl:top-4">
                    <h2 className="text-base lg:text-lg border-l-[5px] border-blue-500 pl-3 font-semibold text-gray-800 mb-4 lg:mb-6">
                      Thông tin sản phẩm
                    </h2>

                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 lg:py-12">
                        <BsMinecartLoaded size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-base lg:text-lg font-semibold text-gray-600 text-center">
                          Không có sản phẩm nào trong giỏ hàng.
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                        {cartItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg border shadow-sm"
                          >
                            <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0">
                              {productImages[item.category.name]?.map(
                                (image) => {
                                  if (
                                    item.selectedVariant &&
                                    image.alt.includes(
                                      item.selectedVariant.value
                                    )
                                  ) {
                                    return (
                                      <img
                                        key={image.id}
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-contain rounded"
                                      />
                                    );
                                  } else if (
                                    !item.selectedVariant &&
                                    image.id === 1
                                  ) {
                                    return (
                                      <img
                                        key={image.id}
                                        src={
                                          productImages[item.category.name][0]
                                            .src
                                        }
                                        alt={
                                          productImages[item.category.name][0]
                                            .alt
                                        }
                                        className="w-full h-full object-contain rounded"
                                      />
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-gray-800 truncate">
                                {item.name}
                              </h3>
                              <div className="text-xs text-gray-600 mt-1 space-y-1">
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
                        <span>{formatCurrency(getTotalPrice() * 1000)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Phí vận chuyển:</span>
                        <span>{formatCurrency(selectedFee)}</span>
                      </div>
                      <div className="flex justify-between text-base lg:text-lg font-semibold text-gray-800 border-t border-gray-200 pt-2 lg:pt-3">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">
                          {formatCurrency(getTotalPrice() * 1000 + selectedFee)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex-1 py-3 px-4 text-sm lg:text-base font-medium bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md transition-colors shadow-sm hover:shadow-md"
                      >
                        Quay lại giỏ hàng
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 text-sm lg:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm hover:shadow-md"
                      >
                        Đặt hàng
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-xl text-center max-w-sm lg:max-w-md w-full mx-4">
            <img
              src={ordersuccess}
              alt="Order Success"
              className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4"
            />
            <h2 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">
              Đặt hàng thành công!
            </h2>
            <p className="text-gray-600 mb-6 text-sm lg:text-base">
              Mã đơn hàng: <span className="font-semibold text-blue-600">{order.code}</span>
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors w-full sm:w-auto"
              onClick={() => handleConfirm()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
