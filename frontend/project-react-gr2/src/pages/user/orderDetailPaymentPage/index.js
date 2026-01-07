import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiX } from "react-icons/fi";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { formatCurrency } from "../../../utils/common";
import { api } from "../../../utils/apiClient";

const OrderDetailPaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/order/${orderId}`);
        const data = response.data || response;
        
        setOrder(data.data || data);
        setError(null);
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setError(err.response?.data?.message || "Lỗi khi lấy thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaBox className="w-5 h-5 text-blue-500" />;
      case "confirmed":
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case "shipping":
        return <FaTruck className="w-5 h-5 text-yellow-500" />;
      case "delivered":
        return <FaCheckCircle className="w-5 h-5 text-green-600" />;
      case "canceled":
        return <FiX className="w-5 h-5 text-red-500" />;
      default:
        return <FaBox className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: "Đang chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang vận chuyển",
      delivered: "Đã giao",
      canceled: "Đã hủy",
    };
    return statusLabels[status] || "Không xác định";
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-200 text-green-800",
      shipping: "bg-blue-100 text-blue-800",
      delivered: "bg-green-200 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusLabel = (status) => {
    const labels = {
      pending: "Chờ thanh toán",
      paid: "Đã thanh toán",
      failed: "Thanh toán thất bại",
    };
    return labels[status] || "Không xác định";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <FiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate("/vnpay/return")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại kết quả thanh toán
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-center text-gray-600 mb-4">Không tìm thấy đơn hàng</h1>
          <button
            onClick={() => navigate("/vnpay/return")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại kết quả thanh toán
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Order Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Đơn hàng #{order.code}
                </h1>
                <p className="text-sm text-gray-500">
                  Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold w-fit ${getStatusColor(order.status)}`}>
                  <span>{getStatusLabel(order.status)}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold w-fit ${getPaymentStatusColor(order.payment_status)}`}>
                  <span>{getPaymentStatusLabel(order.payment_status)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chi tiết sản phẩm</h2>
            <div className="space-y-4">
              {order.order_item && order.order_item.length > 0 ? (
                order.order_item.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                    {item.product_variant_image && (
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={`${process.env.REACT_APP_LARAVEL_APP}/storage/${item.product_variant_image}`}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.product_name || "Sản phẩm"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Màu: {item.product_variant_name}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(item.product_variant_price * item.quantity * 1000)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Không có sản phẩm trong đơn hàng</p>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Tên khách hàng</p>
                <p className="text-gray-800 font-semibold">{order.customer_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">Số điện thoại</p>
                <p className="text-gray-800 font-semibold">{order.customer_phone || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1 font-medium">Địa chỉ giao hàng</p>
                <p className="text-gray-800">{order.shipping_address || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1 font-medium">Ghi chú</p>
                <p className="text-gray-800">{order.note || "Không có ghi chú"}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-semibold">
                  {formatCurrency((order.total_price || 0))}
                </span>
              </div>
              {order.shipping_fee && (
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold">
                    {formatCurrency(order.shipping_fee)}
                  </span>
                </div>
              )}
              {order.discount && (
                <div className="flex justify-between text-gray-600">
                  <span>Giảm giá:</span>
                  <span className="font-semibold text-green-600">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatCurrency((order.final_total || order.total_price || 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/product-list")}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Tiếp tục mua sắm
            </button>
            <button
              onClick={() => navigate("/order-history")}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Tra cứu đơn hàng khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPaymentPage;
