import React, { useState, useEffect } from "react";
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
      if (!order.shipping_province) return;
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
  }, [order.shipping_province]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!order.shipping_district) return;
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
  }, [order.shipping_district]);

  const calculateShippingFee = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:9000/api/shipping-fee",
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
  };

  useEffect(() => {
    if (
      order.shipping_province &&
      order.shipping_district &&
      order.shipping_ward
    ) {
      calculateShippingFee();
    }
  }, [order.shipping_province, order.shipping_district, order.shipping_ward]);

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Thông tin đơn hàng gửi đi", order);

      const response = await axios.post(
        "http://127.0.0.1:9000/api/order",
        order
      );
      setOrder({ ...order, ...response.data.data });
      setOrderCode(response.data.data.code);

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
      }
    } catch (error) {
      console.error(
        "Error create order:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <form className="" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center bg-gray-100 max-h-[1500px]">
          <div className="font-[sans-serif] bg-white my-6 mb-12 w-4/6 h-full p-5 rounded-xl">
            <div className="flex flex-row gap-4">
              <div className="flex-1 h-max rounded-md px-4 py-2">
                <h2 className="border-l-[5px] pl-1 border-[#00adf0] text-2xl font-bold text-gray-800 mb-7">
                  Thông tin đặt hàng
                </h2>
                <div>
                  <h3 className="text-sm lg:text-base font-semibold text-gray-800 mb-4">
                    Thông tin người nhận
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="customer_name"
                        placeholder="Họ và tên"
                        value={order.customer_name}
                        onChange={handleChange}
                        required
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
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
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="customer_email"
                        placeholder="Email"
                        value={order.customer_email}
                        onChange={handleChange}
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-sm font-semibold lg:text-base text-gray-800 mb-4">
                    Địa chỉ nhận hàng
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
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
                        className="px-4 py-3 bg-gray-100 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none border border-gray-300"
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
                        className="px-4 py-3 bg-gray-100 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none border border-gray-300"
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
                        className="px-4 py-3 bg-gray-100 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none border border-gray-300"
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
                        className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold lg:text-base text-gray-800 mb-4">
                    Đơn vị vận chuyển
                  </h3>
                  {Object.keys(shippingUnits).length === 0 ? null : (
                    <div className="grid grid-cols-2 gap-4">
                      {["GHTK", "GHN"].map((key) => {
                        const value = shippingUnits[key];
                        let fee = 0;
                        let imageUrl = key === "GHTK" ? ghtk : ghn;
                        let imageSize =
                          key === "GHTK" ? "w-18 h-5" : "w-14 h-8";

                        if (key === "GHTK" && value.success) {
                          fee = value.fee.options.shipMoney;
                        } else if (key === "GHN" && value.code === 200) {
                          fee = value.data.service_fee;
                        }

                        return (
                          <div
                            key={key}
                            className="flex items-center p-3 border rounded-md cursor-pointer"
                            onClick={() => handleShippingUnitChange(key, fee)}
                          >
                            <input
                              id={key}
                              type="radio"
                              name="shipping_unit"
                              required
                              value={key}
                              className="mr-2"
                            />
                            <img
                              src={imageUrl}
                              alt={key}
                              className={`${imageSize} mr-2`}
                            />
                            <label className="text-sm font-semibold text-gray-800 cusor-pointer">
                              {key === "GHTK"
                                ? "Giao hàng tiết kiệm"
                                : "GHN - Nhanh"}{" "}
                              <span className="text-blue-600 ml-2">
                                {formatCurrency(fee)}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="text-sm font-semibold lg:text-base text-gray-800 mb-4">
                    Phương thức thanh toán
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center">
                        <button
                          type="button"
                          className={`w-full py-3 border text-gray-800 text-sm font-semibold rounded-lg flex items-center ${
                            selectedMethod === method.id
                              ? "border-[#007bff]"
                              : "hover:border-[#007bff]"
                          }`}
                          onClick={() => handleSelectMethod(method.id)}
                        >
                          <span className="w-6 h-6 flex justify-center items-center mr-2 ml-1">
                            {selectedMethod === method.id && (
                              <GiCheckMark className="text-blue-600" />
                            )}
                          </span>
                          {method.label}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-[0.5] h-max">
                <div className="rounded-xl px-6 py-4 bg-gray-100">
                  <div className="h-full p-3 rounded-md">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mt-6">
                        <BsMinecartLoaded size={100} />
                        <h3 className="text-xl font-semibold">
                          Không có sản phẩm nào trong giỏ hàng.
                        </h3>
                      </div>
                    ) : (
                      cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="w-full h-max mb-4 border-b border-gray-200 pb-4"
                        >
                          <h2 className="text-lg border-l-[5px] border-[#00adf0] pl-1 font-semibold text-gray-800 mb-5">
                            Thông tin sản phẩm
                          </h2>
                          <div className="flex items-start gap-4">
                            <div className="w-28 h-28 flex p-1 shrink-0 rounded-md">
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
                                        className="w-full object-contain"
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
                                        className="w-full h-full object-contain"
                                      />
                                    );
                                  }
                                  return null;
                                }
                              )}
                            </div>
                            <div className="w-full">
                              <h3 className="text-sm font-semibold lg:text-base text-gray-800">
                                {item.name}
                              </h3>
                              <ul className="text-xs text-gray-800 space-y-1 mt-3">
                                <li className="flex flex-wrap gap-4">
                                  Số lượng
                                  <span className="ml-auto">
                                    {item.quantity}
                                  </span>
                                </li>
                                <li className="flex flex-wrap gap-4">
                                  Giá tiền
                                  <span className="ml-auto">
                                    {formatCurrency(item.price * 1000)}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="w-full p-1 mt-1 border-b border-gray-200">
                      <h4 className="flex flex-wrap text-sm mb-1 font-semibold text-gray-800">
                        Tạm tính:{" "}
                        <span className="ml-auto">
                          {formatCurrency(getTotalPrice() * 1000)}
                        </span>
                      </h4>
                      <h4 className="flex flex-wrap mb-2 text-sm font-semibold text-gray-800">
                        Phí vận chuyển:{" "}
                        <span className="ml-auto">
                          {formatCurrency(selectedFee)}
                        </span>
                      </h4>
                    </div>
                    <h4 className="flex flex-wrap mt-2 ml-1 text-lg font-semibold text-gray-800">
                      Tổng cộng:{" "}
                      <span className="ml-auto text-lg font-semibold text-blue-600">
                        {formatCurrency(getTotalPrice() * 1000 + selectedFee)}
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="flex gap-4 max-md:flex-col mt-8">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 max-md:order-1"
                  >
                    Quay lại giỏ hàng
                  </button>
                  <button
                    type="submit"
                    className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Đặt hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div>
        {orderSuccess && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
              <img
                src={ordersuccess}
                alt="iPhone 12"
                className="w-20 h-20 mx-auto"
              />
              <h2 className="text-2xl font-bold mb-4">
                Đặt hàng thành công! Mã đơn hàng: {order.code}
              </h2>

              <button
                className="bg-green-500 text-white px-6 py-2 rounded-md"
                onClick={() => handleConfirm()}
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
