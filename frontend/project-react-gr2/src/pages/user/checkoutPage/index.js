import React, { useEffect, useState } from "react";
import { useCart } from "../../../component/CartContext";
import { BsMinecartLoaded } from "react-icons/bs";
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
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const { cartItems, getTotalPrice } = useCart();
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

  return (
    <div className="flex items-center justify-center bg-gray-100 max-h-[1500px]">
      <div className="font-[sans-serif] bg-white my-4 w-4/6 h-full p-5 rounded-xl">
        <div className="flex flex-row gap-4">
          <div className="flex-[0.5] h-max rounded-xl px-6 py-4 bg-gray-100">
            <div className="h-full p-3 rounded-md">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-6">
                  <BsMinecartLoaded size={100} />
                  <br />
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-5">
                      Thông tin sản phẩm
                    </h2>
                    <div className="flex items-start gap-4">
                      <div className="w-28 h-28 flex p-1 shrink-0 rounded-md">
                        {productImages[item.category.name]?.map((image) => {
                          if (
                            item.selectedVariant &&
                            image.alt.includes(item.selectedVariant.value)
                          ) {
                            return (
                              <img
                                key={image.id}
                                src={image.src}
                                alt={image.alt}
                                className="w-full object-contain"
                              />
                            );
                          } else if (!item.selectedVariant && image.id === 1) {
                            return (
                              <img
                                key={image.id}
                                src={productImages[item.category.name][0].src}
                                alt={productImages[item.category.name][0].alt}
                                className="w-full h-full object-contain"
                              />
                            );
                          }
                          return null;
                        })}
                      </div>

                      <div className="w-full">
                        <h3 className="text-sm font-semibold lg:text-base text-gray-800">
                          {item.name}
                        </h3>
                        <ul className="text-xs text-gray-800 space-y-1 mt-3">
                          <li className="flex flex-wrap gap-4">
                            Số lượng
                            <span className="ml-auto">{item.quantity}</span>
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
                  <span className="ml-auto">{formatCurrency(30000)}</span>
                </h4>
              </div>
              <h4 className="flex flex-wrap mt-2 ml-1 text-lg font-semibold text-gray-800">
                Tổng cộng:{" "}
                <span className="ml-auto text-lg font-semibold text-blue-600">
                  {formatCurrency(getTotalPrice() * 1000 + 30000) }
                </span>
              </h4>
            </div>
          </div>

          <div className="flex-1 h-max rounded-md px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Thông tin nhận hàng
            </h2>
            <form className="mt-8">
              <div>
                <h3 className="text-sm lg:text-base text-gray-800 mb-4">
                  Thông tin người nhận
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Phone No."
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm lg:text-base text-gray-800 mb-4">
                  Địa chỉ nhận hàng
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Address Line"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="City"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-blue-600"
                    />
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
                    type="button"
                    onClick={() => alert("Đặt hàng thành công!")}
                    className="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Đặt hàng
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
