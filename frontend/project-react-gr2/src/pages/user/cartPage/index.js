import { useCart } from "../../../component/CartContext";
import "./stylecart.scss";
import { BsMinecartLoaded } from "react-icons/bs";

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItem } = useCart();

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
                          <img
                            src={item.image}
                            className="w-full h-full object-contain"
                          />
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
                          onClick={() => {
                            handleQuantityChange(
                              item.id,
                              item.selectedVariant
                                ? item.selectedVariant.id
                                : null,
                              item.quantity - 1
                            );
                          }}
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
                          onClick={() => {
                            handleQuantityChange(
                              item.id,
                              item.selectedVariant
                                ? item.selectedVariant.id
                                : null,
                              item.quantity + 1
                            );
                          }}
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
                        {(item.selectedVariant
                          ? item.selectedVariant.price
                          : item.price) * item.quantity}
                        .000đ
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
                          class="w-7 fill-red-500 inline cursor-pointer"
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
                {getTotalPrice()}.000đ
              </h3>
            </div>

            <button
              onClick={() => alert("Chuyển đến trang thanh toán!")}
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
