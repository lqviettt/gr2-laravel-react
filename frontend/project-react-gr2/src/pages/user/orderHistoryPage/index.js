import React, { useState, useEffect } from "react";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import Section from "../../../component/user/Section";
import { formatCurrency } from "../../../utils/common";
import { StatusBadge, Button, NoData } from "../../../components";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Giả sử API lấy đơn hàng của user hiện tại
      // const response = await fetch(`${process.env.REACT_APP_API_URL}/user/orders`);
      // const data = await response.json();
      // setOrders(data.data || []);

      // Mock data cho demo
      const mockOrders = [
        {
          id: "ORD001",
          code: "DH20241111001",
          status: "delivered",
          total_price: 25000000,
          shipping_fee: 30000,
          created_at: "2024-11-11T10:00:00Z",
          customer_name: "Nguyễn Văn A",
          customer_phone: "0123456789",
          customer_email: "nguyenvana@example.com",
          shipping_address: "123 Đường ABC, Quận 1, TP.HCM",
          payment_method: "COD",
          items: [
            {
              product_id: 1,
              product_name: "iPhone 15 Pro",
              variant_name: "Titan Đen",
              quantity: 1,
              price: 25000000,
              image: "/placeholder-image.jpg"
            }
          ]
        },
        {
          id: "ORD002",
          code: "DH20241111002",
          status: "shipping",
          total_price: 18000000,
          shipping_fee: 25000,
          created_at: "2024-11-10T15:30:00Z",
          customer_name: "Nguyễn Văn A",
          customer_phone: "0123456789",
          customer_email: "nguyenvana@example.com",
          shipping_address: "123 Đường ABC, Quận 1, TP.HCM",
          payment_method: "VNBANK",
          items: [
            {
              product_id: 2,
              product_name: "iPhone 14 Pro",
              variant_name: "Đen",
              quantity: 1,
              price: 18000000,
              image: "/placeholder-image.jpg"
            }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <Section>
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 lg:mb-8">
                Đơn hàng của tôi
              </h1>

              {orders.length === 0 ? (
                <NoData
                  title="Bạn chưa có đơn hàng nào"
                  description="Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!"
                  action={
                    <Button
                      onClick={() => window.location.href = "/"}
                      variant="primary"
                    >
                      Tiếp tục mua sắm
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4 lg:space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 lg:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {order.status === "pending" && <FaBox className="text-yellow-500" />}
                            {order.status === "processing" && <FaBox className="text-blue-500" />}
                            {order.status === "shipping" && <FaTruck className="text-orange-500" />}
                            {order.status === "completed" && <FaCheckCircle className="text-green-500" />}
                            {order.status === "cancelled" && <FaTimesCircle className="text-red-500" />}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              Đơn hàng #{order.code}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                          <StatusBadge status={order.status} />
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {formatCurrency(order.total_price)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} sản phẩm
                            </p>
                          </div>
                          <Button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            variant="outline"
                            size="small"
                            leftIcon={<FaEye />}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </div>

                      {selectedOrder?.id === order.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Thông tin đơn hàng</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Người nhận:</span> {order.customer_name}</p>
                                <p><span className="font-medium">Số điện thoại:</span> {order.customer_phone}</p>
                                <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                                <p><span className="font-medium">Địa chỉ:</span> {order.shipping_address}</p>
                                <p><span className="font-medium">Thanh toán:</span> {order.payment_method === "COD" ? "Thanh toán khi nhận hàng" : "Đã thanh toán online"}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3">Sản phẩm</h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                    <img
                                      src={item.image}
                                      alt={item.product_name}
                                      className="w-12 h-12 object-contain rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-gray-800 truncate">
                                        {item.product_name}
                                      </h5>
                                      {item.variant_name && (
                                        <p className="text-sm text-gray-600">{item.variant_name}</p>
                                      )}
                                      <p className="text-sm text-gray-600">
                                        SL: {item.quantity} × {formatCurrency(item.price)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <p>Tạm tính: {formatCurrency(order.total_price - order.shipping_fee)}</p>
                                <p>Phí vận chuyển: {formatCurrency(order.shipping_fee)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-blue-600">
                                  Tổng: {formatCurrency(order.total_price)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default OrderHistoryPage;