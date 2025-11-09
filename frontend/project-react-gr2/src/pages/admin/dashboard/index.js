import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaUsers, FaDollarSign, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all orders (assuming API supports large per_page or we fetch multiple pages)
        const queryParams = new URLSearchParams();
        queryParams.append('per_page', '1000'); // Fetch up to 1000 orders
        const ordersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/order?${queryParams.toString()}`);
        
        let orders = [];
        if (ordersResponse.data && typeof ordersResponse.data === 'object' && 'data' in ordersResponse.data) {
          if (typeof ordersResponse.data.data === 'object' && 'data' in ordersResponse.data.data && Array.isArray(ordersResponse.data.data.data)) {
            // Paginated response
            orders = ordersResponse.data.data.data;
          } else if (Array.isArray(ordersResponse.data.data)) {
            orders = ordersResponse.data.data;
          } else if (Array.isArray(ordersResponse.data)) {
            orders = ordersResponse.data;
          }
        }

        // Calculate stats
        const totalOrders = Array.isArray(orders) ? orders.length : 0;
        const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) : 0;
        const totalCustomers = Array.isArray(orders) ? new Set(orders.map(order => order.customer_email || order.customer_phone)).size : 0;
        const pendingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'pending').length : 0;
        const shippingOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'shipping').length : 0;
        const deliveredOrders = Array.isArray(orders) ? orders.filter(order => order.status === 'delivered').length : 0;

        setStats({
          totalOrders,
          totalRevenue,
          totalCustomers,
          pendingOrders,
          shippingOrders,
          deliveredOrders,
        });

        // Get recent orders (last 5)
        const recent = Array.isArray(orders) 
          ? orders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map(order => ({
                ...order,
                created_at_formatted: formatDate(order.created_at),
              }))
          : [];
        setRecentOrders(recent);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <span className="ml-3 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Tổng quan về hoạt động của cửa hàng</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaShoppingCart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaClipboardList className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaShoppingCart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang giao</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shippingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaDollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã giao</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveredOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaDollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Đơn hàng gần đây</h2>
              <a
                href="/admin/order-list"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Xem tất cả →
              </a>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(recentOrders) && recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipping'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status === 'delivered' ? 'Đã giao' :
                         order.status === 'shipping' ? 'Đang giao' :
                         order.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at_formatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;