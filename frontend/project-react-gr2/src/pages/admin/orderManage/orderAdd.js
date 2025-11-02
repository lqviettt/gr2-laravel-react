import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderAdd = () => {
  const [order, setOrder] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    status: "pending",
    shipping_province: "",
    shipping_district: "",
    shipping_address_detail: "",
    order_item: [
      {
        product_id: "",
        product_variant_id: "",
        quantity: "",
        price: "",
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...order.order_item];
    items[index][name] = value;
    setOrder({
      ...order,
      order_item: items,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/order`,
            order
          );
          setOrder([...order, response.data.data]);
        } catch (error) {
          console.error("Error adding order:", error);
        }
    toast.success("Order submitted successfully!");
    console.log(order);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Thêm đơn hàng mới</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap max-w-lg mx-auto p-4 bg-white shadow-md rounded"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Customer Name:</label>
          <input
            type="text"
            name="customer_name"
            value={order.customer_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Customer Phone:</label>
          <input
            type="text"
            name="customer_phone"
            value={order.customer_phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Customer Email:</label>
          <input
            type="email"
            name="customer_email"
            value={order.customer_email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status:</label>
          <input
            type="text"
            name="status"
            value={order.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Shipping Province:</label>
          <input
            type="text"
            name="shipping_province"
            value={order.shipping_province}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Shipping District:</label>
          <input
            type="text"
            name="shipping_district"
            value={order.shipping_district}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Shipping Address Detail:
          </label>
          <input
            type="text"
            name="shipping_address_detail"
            value={order.shipping_address_detail}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {order.order_item.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="mb-2">
              <label className="block text-gray-700">Product ID:</label>
              <input
                type="text"
                name="product_id"
                value={item.product_id}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Product Variant ID:</label>
              <input
                type="number"
                name="product_variant_id"
                value={item.product_variant_id}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Price:</label>
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Order
        </button>
      </form>
    </div>
  );
};

export default OrderAdd;
