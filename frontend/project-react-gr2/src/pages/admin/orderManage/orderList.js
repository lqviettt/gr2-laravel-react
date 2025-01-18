import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
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
      console.error(
        "Error saving order:",
        error.response?.data || error.message
      );
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      {editingOrderId && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Edit Order</h2>
          <input
            type="text"
            placeholder="Order Code"
            value={newOrder.code}
            onChange={(e) => setNewOrder({ ...newOrder, code: e.target.value })}
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="text"
            placeholder="Customer Name"
            value={newOrder.customer_name}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customer_name: e.target.value })
            }
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="text"
            placeholder="Customer Phone"
            value={newOrder.customer_phone}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customer_phone: e.target.value })
            }
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="email"
            placeholder="Customer Email"
            value={newOrder.customer_email}
            onChange={(e) =>
              setNewOrder({ ...newOrder, customer_email: e.target.value })
            }
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="text"
            placeholder="Shipping Province"
            value={newOrder.shipping_province}
            onChange={(e) =>
              setNewOrder({ ...newOrder, shipping_province: e.target.value })
            }
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="text"
            placeholder="Shipping District"
            value={newOrder.shipping_district}
            onChange={(e) =>
              setNewOrder({ ...newOrder, shipping_district: e.target.value })
            }
            className="mb-2 px-4 py-2 border"
          />
          <input
            type="text"
            placeholder="Shipping Address Detail"
            value={newOrder.shipping_address_detail}
            onChange={(e) =>
              setNewOrder({
                ...newOrder,
                shipping_address_detail: e.target.value,
              })
            }
            className="mb-2 px-4 py-2 border"
          />
          {/* Các trường cho order_items có thể được xử lý sau */}
          <button
            onClick={handleSaveOrder}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Order
          </button>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">STT</th>
            <th className="py-2 px-4 border-b">Mã sản phẩm</th>
            <th className="py-2 px-4 border-b">Tên khách hàng</th>
            <th className="py-2 px-4 border-b">SĐT</th>
            <th className="py-2 px-4 border-b">Thông tin giao hàng</th>
            <th className="py-2 px-4 border-b">Tên sản phẩm</th>
            <th className="py-2 px-4 border-b">Màu sắc</th>
            <th className="py-2 px-4 border-b">Số lượng</th>
            <th className="py-2 px-4 border-b">Tổng tiền</th>
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
              <td className="py-2 px-4 border-b">
                {order.order_item.map((item) => (
                  <div key={item.id}>
                    {formatCurrency(item.quantity * item.price * 1000)}
                  </div>
                ))}
              </td>
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
    </div>
  );
};

export default OrderList;
