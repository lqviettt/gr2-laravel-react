import React, { useState, useEffect } from "react";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaEye, FaSearch } from "react-icons/fa";
import Section from "../../../component/user/Section";
import { formatCurrency } from "../../../utils/common";
import { StatusBadge, Button, NoData } from "../../../components";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Không tải dữ liệu khi vào trang, chỉ hiện message "Nhập mã để tìm"
  }, []);

  const fetchOrders = async (code = "") => {
    // Nếu không có code, không gọi API
    if (!code) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_URL}/order?code=${code}`;
      
      const response = await fetch(url);
      const responseData = await response.json();
      
      // Xử lý dữ liệu từ API - API trả về { data: { data: [...], current_page, ... }, status, message }
      let ordersData = [];
      if (responseData && responseData.data) {
        const paginatedData = responseData.data;
        // Nếu data.data là array (pagination)
        if (paginatedData.data && Array.isArray(paginatedData.data)) {
          ordersData = paginatedData.data;
        } 
        // Nếu data là array trực tiếp
        else if (Array.isArray(paginatedData)) {
          ordersData = paginatedData;
        }
      }
      
      // Lọc ra các order hợp lệ (có status) và transform dữ liệu
      const validOrders = ordersData
        .filter(order => order && order.status)
        .map(order => ({
          ...order,
          items: order.order_item || [] // Rename order_item thành items để match với code UI
        }));
      
      setOrders(validOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    fetchOrders(searchCode);
  };

  const handleReset = () => {
    setSearchCode("");
    setHasSearched(false);
    fetchOrders();
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
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <a href="/" className="text-blue-600 hover:underline">Trang chủ</a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Tra cứu đơn hàng</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 lg:mb-8">
                Tra cứu đơn hàng
              </h1>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã đơn hàng..."
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="small"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={handleReset}
                  >
                    Xóa
                  </Button>
                </div>
              </form>

              {orders.length === 0 ? (
                <NoData
                  title={hasSearched ? "Không tìm thấy đơn hàng" : "Vui lòng nhập mã đơn hàng để tra cứu"}
                  description={hasSearched ? "Mã đơn hàng không tồn tại trong hệ thống" : "Nhập mã đơn hàng của bạn và click 'Tìm kiếm' để xem chi tiết"}
                  action={
                    hasSearched ? (
                      <Button
                        onClick={handleReset}
                        variant="primary"
                      >
                        Tìm kiếm lại
                      </Button>
                    ) : null
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
                                    <div className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                                      <img
                                        src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${item.product_variant_image}`}
                                        alt={item.name}
                                        className="w-full sm:w-4/5 h-auto mb-2.5"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-gray-800 truncate">
                                        {item.product_name}
                                      </h5>
                                      {item.product_variant_name && (
                                        <p className="text-sm text-gray-600">{item.product_variant_name}</p>
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