import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    code: "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    status: "",
    shipping_province: "",
    shipping_district: "",
    shipping_address_detail: "",
    order_item: [],
    created_by: "admin",
  });

  const [editingOrderId, setEditingOrderId] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:9000/api/order");
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleEditOrder = (orderId) => {
    const orderToEdit = orders.find((order) => order.id === orderId);
    const { shipping_address } = orderToEdit;
    const { code } = orderToEdit;
    const origin_code = code.split("-");
    const addressParts = shipping_address.split(", ");

    setNewOrder({
      ...orderToEdit,
      code: origin_code[1] || "",
      shipping_province: addressParts[0] || "",
      shipping_district: addressParts[1] || "",
      shipping_address_detail: addressParts[2] || "",
      created_by: orderToEdit.created_by,
    });
    setIsModalOpen(true);
    setEditingOrderId(orderId);
  };

  const handleSaveOrder = async () => {
    try {
      const orderToSave = {
        ...newOrder,
        created_by: newOrder.created_by,
        order_item: newOrder.order_item.map((item) => ({
          ...item,
          price: parseInt(item.price, 10) || 0,
        })),
      };

      const response = await axios.put(
        `http://127.0.0.1:9000/api/order/${editingOrderId}`,
        orderToSave
      );
      setOrders(
        orders.map((order) =>
          order.id === editingOrderId ? response.data.data : order
        )
      );
      setEditingOrderId(null);
      alert("Order saved successfully!");
      window.location.reload();
    } catch (error) {
      let message = "An unexpected error occurred. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            message = "Please check your input.";
            break;
          case 403:
            message =
              "Forbidden. You don't have permission to perform this action.";
            break;
          case 404:
            message = "Order not found.";
            break;
          case 500:
            message = "Internal Server Error. Please try again later.";
            break;
          default:
            message = error.response.data?.message || message;
            break;
        }
      }
      setErrorMessage(message);
      console.error("Error saving order:", message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this order?")) {
        return;
      }
      await axios.delete(`http://127.0.0.1:9000/api/order/${orderId}`);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="container p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <table className="bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-8 border-b">Mã sản phẩm</th>
            <th className="py-2 px-4 border-b">Tên khách hàng</th>
            <th className="py-2 px-4 border-b">SĐT</th>
            <th className="py-2 px-4 border-b">Thông tin giao hàng</th>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Màu sắc</th>
            <th className="py-2 px-4 border-b">Số lượng</th>
            <th className="py-2 px-4 border-b">Tổng tiền</th>
            <th className="py-2 px-4 border-b">Ngày đặt hàng</th>
            <th className="py-2 px-4 border-b">Trạng thái</th>
            <th className="py-2 px-4 border-b">Tùy biến</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                {orders.indexOf(order) + 1}
              </td>
              <td className="py-2 px-4 border-b">{order.code}</td>
              <td className="py-2 px-4 border-b">{order.customer_name}</td>
              <td className="py-2 px-4 border-b">{order.customer_phone}</td>
              <td className="py-2 px-4 border-b">{order.shipping_address}</td>
              <td className="py-2 px-4 border-b">
                {order.order_item.map((item) => (
                  <div key={item.id}>{item.product_name}</div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">
                {order.order_item.map((item) => (
                  <div key={item.id}>{item.product_variant_name}</div>
                ))}
              </td>
              <td className="py-2 px-4 border-b">
                {order.order_item.map((item) => (
                  <div key={item.id}>{item.quantity}</div>
                ))}
              </td>
              <td className="py-2 px-4 mb-4 border-b">
                {formatCurrency(order.total_price)}
              </td>
              <td className="py-2 px-4 border-b">{order.created_at}</td>
              <td className="py-2 px-4 border-b">{order.status}</td>
              <td className="py-2 px-4 border-b flex justify-center items-center">
                <button
                  onClick={() => handleEditOrder(order.id)}
                  className="px-2 py-2 bg-yellow-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="px-2 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Order
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSaveOrder}>
              <div class="grid gap-4 mb-4 grid-cols-2">
                <div class="col-span-2">
                  <label
                    for="name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newOrder.customer_name}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customer_name: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Tên khách hàng"
                    required=""
                  />
                </div>
                <div class="col-span-2">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newOrder.shipping_address}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        shipping_address: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Địa chỉ giao hàng"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    SĐT
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={newOrder.customer_phone}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        customer_phone: e.target.value,
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Số điện thoại"
                    required=""
                  />
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Trạng thái
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={newOrder.status}
                    required=""
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, status: e.target.value })
                    }
                  >
                    <option value="pending">Đang chờ</option>
                    <option value="shipping">Giao hàng</option>
                    <option value="delivered">Đã giao</option>
                    <option value="canceled">Đã hủy</option>
                  </select>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label
                    for="price"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Tổng tiền
                  </label>
                  <input
                    type="text"
                    name="status"
                    value={newOrder.total_price}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, total_price: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Total price"
                    required=""
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded ml-2"
              >
                Cancel
              </button>
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
