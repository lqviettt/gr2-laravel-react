import { useCart } from "../../../component/CartContext";
import "./stylecart.scss";
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

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
    <div className="pt-6 pb-10 bg-gray-100">
      <div className="font-sans bg-white max-w-6xl mx-auto p-4 rounded-md">
        <div className="overflow-x-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-6">
              <BsMinecartLoaded size={100} />
              <br />
              <h3 className="text-xl font-semibold">
                Không có sản phẩm nào trong giỏ hàng.
              </h3>
            </div>
          ) : (
            <table className="mt-6 w-full border-collapse divide-y">
              <thead className="whitespace-nowrap text-left">
                <tr>
                  <th className="text-base text-gray-500 font-medium p-2">
                    Thông tin sản phẩm
                  </th>
                  <th className="text-base text-gray-500 font-medium p-2">
                    Số lượng
                  </th>
                  <th className="text-base text-gray-500 font-medium p-2">
                    Đơn giá
                  </th>
                  <th className="text-base text-gray-500 font-medium p-2">
                    Tùy chỉnh
                  </th>
                </tr>
              </thead>

              <tbody className="whitespace-nowrap divide-y">
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-4 w-max">
                        <div className="w-28 h-28 shrink-0">
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
                                  className="w-full h-full object-contain"
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
                        <div>
                          <p className="text-xl font-semibold text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm">
                            {item.selectedVariant
                              ? item.selectedVariant.value
                              : null}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="">
                      <div className="flex gap-2 items-center bg-white px-3 h-9 w-max">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedVariant
                                ? item.selectedVariant.id
                                : null,
                              item.quantity - 1
                            )
                          }
                          className="border bg-blue-400 hover:bg-red-700 text-white rounded-md p-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 121.805 121.804"
                          >
                            <path d="M7.308 68.211h107.188a7.309 7.309 0 0 0 7.309-7.31 7.308 7.308 0 0 0-7.309-7.309H7.308a7.31 7.31 0 0 0 0 14.619z" />
                          </svg>
                        </button>

                        <span className="text-gray-800 text-lg font-semibold px-2">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedVariant
                                ? item.selectedVariant.id
                                : null,
                              item.quantity + 1
                            )
                          }
                          className="border bg-blue-400 hover:bg-red-700 text-white rounded-md p-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                            viewBox="0 0 512 512"
                          >
                            <path d="M256 509.892c-19.058 0-34.5-15.442-34.5-34.5V36.608c0-19.058 15.442-34.5 34.5-34.5s34.5 15.442 34.5 34.5v438.784c0 19.058-15.442 34.5-34.5 34.5z" />
                            <path d="M475.392 290.5H36.608c-19.058 0-34.5-15.442-34.5-34.5s15.442-34.5 34.5-34.5h438.784c19.058 0 34.5 15.442 34.5 34.5s-15.442 34.5-34.5 34.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td className="px-2 py-4">
                      <span className="text-blue-500 text-xl font-semibold px-3">
                        {formatCurrency(
                          (item.selectedVariant
                            ? item.selectedVariant.price
                            : item.price) *
                            item.quantity *
                            1000
                        )}
                      </span>
                    </td>

                    <td className="px-2 py-4">
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.selectedVariant
                              ? item.selectedVariant.id
                              : null
                          )
                        }
                        className="bg-transparent flex items-center justify-center w-16 h-10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-7 fill-red-500 inline cursor-pointer"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000"
                          ></path>
                          <path
                            d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="w-1/4 ml-auto border-t">
            <div className="flex justify-between mt-6">
              <h3 className="text-2xl font-bold text-gray-800">Tổng tiền:</h3>
              <h3 className="text-2xl font-bold text-blue-500">
                {formatCurrency(getTotalPrice() * 1000)}
              </h3>
            </div>

            <button
              onClick={() => window.location.href = "/checkout"}
              className="rounded-md mt-6 text-lg tracking-wide px-4 py-4 w-full bg-blue-500 hover:bg-red-900 text-white"
            >
              Thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
