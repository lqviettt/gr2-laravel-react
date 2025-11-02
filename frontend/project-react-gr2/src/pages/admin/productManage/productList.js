import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import { FaPlus, FaEdit, FaTrash, FaBox, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    price: "",
    quantity: "",
    status: "1",
    weight: "",
    category_id: "",
    description: "",
  });

  const [editingProductId, setEditingProductId] = useState(null);

  const fields = {
    code: 'code',
    name: 'name',
    price: 'price',
    status: 'status',
    quantity: 'quantity',
    weight: 'weight',
    actions: 'pattern.modified',
  };

  const listTitle = {
    code: 'Mã sản phẩm',
    name: 'Tên sản phẩm',
    price: 'Giá bán',
    status: 'Trạng thái',
    quantity: 'Số lượng',
    weight: 'Trọng lượng',
    actions: 'Tùy biến',
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/product`);
      setProducts(response.data.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải danh sách sản phẩm");
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/category`);
      console.log('Full response:', response.data);
      console.log('Response data.data:', response.data.data);
      console.log('Response data.data.data:', response.data.data?.data);
      setCategories(response.data.data?.data || response.data.data || []);
      console.log("Fetched categories:", response.data.data?.data || response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setNewProduct(productToEdit);
    setEditingProductId(productId);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        // Update existing product
        const productData = {
          ...newProduct,
          category_id: parseInt(newProduct.category_id, 10),
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
          weight: parseFloat(newProduct.weight),
          status: parseInt(newProduct.status, 10),
        };
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/product/${editingProductId}`,
          productData
        );
        setProducts(
          products.map((product) =>
            product.id === editingProductId ? response.data.data : product
          )
        );
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Create new product
        const productData = {
          ...newProduct,
          category_id: parseInt(newProduct.category_id, 10),
          price: parseFloat(newProduct.price),
          quantity: parseInt(newProduct.quantity, 10),
          weight: parseFloat(newProduct.weight),
          status: parseInt(newProduct.status, 10),
        };
        console.log('Sending product data:', productData);
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/product`,
          productData
        );
        setProducts([...products, response.data.data]);
        toast.success("Thêm sản phẩm thành công!");
      }
      setIsModalOpen(false);
      setNewProduct({
        code: "",
        name: "",
        price: "",
        quantity: "",
        status: "1",
        weight: "",
        category_id: "",
        description: "",
      });
      setEditingProductId(null);
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      toast.error("Có lỗi xảy ra khi lưu sản phẩm");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_URL}/product/${productId}`);
      if (Array.isArray(products)) {
        setProducts(products.filter((product) => product.id !== productId));
      }
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
            <p className="text-gray-600">Quản lý các sản phẩm của cửa hàng</p>
          </div>
          <button
            onClick={() => {
              setNewProduct({
                code: "",
                name: "",
                price: "",
                quantity: "",
                status: "1",
                weight: "",
                category_id: "",
                description: "",
              });
              setEditingProductId(null);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </button>
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
                    onClick={fetchProducts}
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
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <FaBox className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(products) ? products.length : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <FaCheckCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(products) ? products.filter(product => product.status === '1').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                      <FaTimesCircle className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(products) ? products.filter(product => product.status !== '1').length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <CommonTable
                fields={fields}
                items={products}
                showIndex={true}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                listTitle={listTitle}
              />
            </div>
          </>
        )}

        {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:max-w-2xl w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
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

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên sản phẩm"
                required
              />
                  </div>

                  <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Mã sản phẩm
              </label>
              <input
                type="text"
                name="code"
                value={newProduct.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mã sản phẩm"
                required
              />
                  </div>

                  <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập giá bán"
                required
              />
                  </div>

                  <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng
              </label>
                        <input
                          type="number"
                          name="quantity"
                          value={newProduct.quantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập số lượng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Trọng lượng (kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="weight"
                          value={newProduct.weight}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập trọng lượng"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                          Danh mục
                        </label>
                        <select
                          name="category_id"
                          value={newProduct.category_id}
                          onChange={handleInputChange}
                          className="w-full px-2 py-2 text-sm sm:px-3 sm:py-2 sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{
                            maxHeight: '120px',
                            overflowY: 'auto'
                          }}
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {Array.isArray(categories) && categories.map((category, index) => {
                            return (
                              <option key={category?.id || index} value={category?.id || ''}>
                                {category?.name || 'No name'}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập mô tả sản phẩm"
                        />
                      </div>
                    </div>

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
                        {editingProductId ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductList);
