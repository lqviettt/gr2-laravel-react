import React, { useEffect, useState, memo, useCallback } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import Pagination from "../../../components/Pagination";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SearchInput from "../../../components/SearchInput";
import { FaShoppingCart, FaClock, FaTruck, FaCheckCircle } from "react-icons/fa";

const OrderList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [searchFilters, setSearchFilters] = useState({
    customer_name: '',
    customer_phone: '',
    status: '',
    start_date: '',
    end_date: '',
  });

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const fetchOrders = useCallback(async (page = currentPage, filters = searchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      if (filters.customer_name) queryParams.append('search', filters.customer_name);
      if (filters.customer_phone) queryParams.append('phone', filters.customer_phone);
      if (filters.status !== undefined && filters.status !== '') queryParams.append('status', filters.status);
      if (filters.start_date) queryParams.append('start_date', filters.start_date);
      if (filters.end_date) queryParams.append('end_date', filters.end_date);
      const response = await api.get(`/order${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
      console.log('Order data:', response.data);
      let ordersData = [];
      let paginationData = {};
      if (response.data && typeof response.data === 'object' && 'data' in response.data && typeof response.data.data === 'object' && 'data' in response.data.data && Array.isArray(response.data.data.data)) {
        // Paginated response
        ordersData = response.data.data.data.map(order => ({
          ...order,
          product_names: order.order_item.map(item => item.product_name || 'N/A').join(', '),
          variants: order.order_item.map(item => item.product_variant_name || 'N/A').join(', '),
          combined_products: order.order_item.map(item => `${item.product_name || 'N/A'}(${item.product_variant_name || 'N/A'})`).join(', '),
          quantities: order.order_item.map(item => item.quantity).join(', '),
          created_at_formatted: formatDate(order.created_at),
        }));
        paginationData = { ...response.data.data };
        delete paginationData.data;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
        paginationData = {};
      } else {
        ordersData = [];
        paginationData = {};
      }
      setOrders(ordersData);
      setPagination(paginationData);
      console.log('Orders data set:', ordersData);
      console.log('Pagination set:', paginationData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Không thể tải danh sách đơn hàng");
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [searchFilters, currentPage]);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    fetchOrders(1, filters);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  const handleEditOrder = (orderId) => {
    const orderToEdit = orders.find((order) => order.id === orderId);
    const { shipping_address } = orderToEdit;

    setNewOrder({
      ...orderToEdit,
      shipping_address_detail: shipping_address,
      created_by: orderToEdit.created_by,
    });
    setIsModalOpen(true);
    setEditingOrderId(orderId);
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    try {
      const addressParts = newOrder.shipping_address_detail.split(", ");
      const orderToSave = {
        ...newOrder,
        shipping_address: newOrder.shipping_address_detail,
        shipping_province: addressParts[0] || "",
        shipping_district: addressParts[1] || "",
        created_by: newOrder.created_by,
        order_item: newOrder.order_item.map((item) => ({
          ...item,
          price: Number.parseInt(item.price, 10) || 0,
        })),
      };

      console.log("Saving order:", orderToSave);

      const response = await api.put(`/order/${editingOrderId}`, orderToSave);

      console.log("Save response:", response.data);

      await fetchOrders();

      setSearchFilters({
        customer_name: '',
        customer_phone: '',
        status: '',
        start_date: '',
        end_date: '',
      });
      setCurrentPage(1);

      setEditingOrderId(null);
      toast.success("Order saved successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Full error:", error);
      let message = "An unexpected error occurred. Please try again.";
      if (error.response) {
        console.log("Error response:", error.response);
        console.log("Error response data:", error.response.data);
        switch (error.response.status) {
          case 400:
            message = error.response.data?.message || "Please check your input.";
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
      toast.error(message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setConfirmAction(() => async () => {
      try {
        await api.delete(`/order/${orderId}`);
        if (Array.isArray(orders)) {
          setOrders(orders.filter((order) => order.id !== orderId));
        }
        toast.success("Xóa đơn hàng thành công!");
        setIsConfirmOpen(false);
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Có lỗi xảy ra khi xóa đơn hàng");
        setIsConfirmOpen(false);
      }
    });
    setIsConfirmOpen(true);
  };

  const fields = {
    code: 'code',
    customer_name: 'customer_name',
    customer_phone: 'customer_phone',
    shipping_address: 'shipping_address',
    combined_products: 'custom.combined_products',
    quantities: 'quantities',
    total_price: 'total_price',
    created_at: 'created_at_formatted',
    status: 'status',
    actions: 'pattern.modified',
  };

  const listTitle = {
    code: 'Mã đơn',
    customer_name: 'Khách hàng',
    customer_phone: 'SĐT',
    shipping_address: 'Địa chỉ',
    combined_products: 'Sản phẩm (Màu sắc)',
    quantities: 'SL',
    total_price: 'Tổng tiền',
    created_at: 'Ngày tạo',
    status: 'Trạng thái',
    actions: 'Thao tác',
  };

  const searchFields = [
    { key: 'customer_name', label: 'Tên khách hàng', type: 'text', placeholder: 'Nhập tên khách hàng' },
    { key: 'customer_phone', label: 'Số điện thoại', type: 'text', placeholder: 'Nhập số điện thoại' },
    { key: 'status', label: 'Trạng thái', type: 'select', placeholder: 'Tất cả', options: [
      { value: 'pending', label: 'Đang chờ' },
      { value: 'shipping', label: 'Đang giao hàng' },
      { value: 'delivered', label: 'Đã giao' },
      { value: 'canceled', label: 'Đã hủy' }
    ]},
    { key: 'start_date', label: 'Từ ngày', type: 'date' },
    { key: 'end_date', label: 'Đến ngày', type: 'date' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
            <p className="text-gray-600">Quản lý các đơn hàng của cửa hàng</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-6">
          <SearchInput
            searchFields={searchFields}
            onSearch={handleSearch}
            useSearchButton={true}
            showClearButton={false}
            className="mb-4"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi tải dữ liệu</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={fetchOrders}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            {!loading && !error && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <FaShoppingCart className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(orders) ? orders.length : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <FaClock className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(orders) ? orders.filter(order => order.status === 'pending').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <FaTruck className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Đang giao</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(orders) ? orders.filter(order => order.status === 'shipping').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <FaCheckCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Đã giao</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(orders) ? orders.filter(order => order.status === 'delivered').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="inline-block min-w-full align-middle">
                  <CommonTable
                    fields={fields}
                    items={orders}
                    showIndex={true}
                    indexByOrder={true}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                    listTitle={listTitle}
                    hiddenOnMobile={['customer_phone', 'shipping_address', 'created_at']}
                    columnStyles={{
                      created_at: { minWidth: '120px', whiteSpace: 'nowrap' },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Chỉnh sửa đơn hàng
                    </h3>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveOrder} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                          Mã đơn hàng
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={newOrder.code}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Địa chỉ giao hàng
                        </label>
                        <input
                          type="text"
                          name="shipping_address_detail"
                          value={newOrder.shipping_address_detail}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              shipping_address_detail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập địa chỉ giao hàng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="created_at" className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày tạo
                        </label>
                        <input
                          type="text"
                          name="created_at"
                          value={newOrder.created_at}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div>
                        <label htmlFor="created_by" className="block text-sm font-medium text-gray-700 mb-1">
                          Người tạo
                        </label>
                        <input
                          type="text"
                          name="created_by"
                          value={newOrder.created_by}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                          Trạng thái
                        </label>
                        <select
                          name="status"
                          value={newOrder.status}
                          onChange={(e) =>
                            setNewOrder({ ...newOrder, status: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="pending">Đang chờ</option>
                          <option value="shipping">Đang giao hàng</option>
                          <option value="delivered">Đã giao</option>
                          <option value="canceled">Đã hủy</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="total_price" className="block text-sm font-medium text-gray-700 mb-1">
                          Tổng tiền
                        </label>
                        <input
                          type="text"
                          name="total_price"
                          value={newOrder.total_price}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa đơn hàng này?"
          confirmText="Xóa"
          cancelText="Hủy"
          onConfirm={() => confirmAction && confirmAction()}
          onCancel={() => setIsConfirmOpen(false)}
          type="danger"
        />
      </div>
    </div>
  );
};

export default memo(OrderList);