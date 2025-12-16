import React, { useState, useEffect, memo } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";

const CategoryManageList = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories(searchFilters, currentPage);
  }, [searchFilters, currentPage]);

  const fetchCategories = async (filters = {}, page = currentPage) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const effectiveFilters = { ...filters };
      Object.entries(effectiveFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      queryParams.append('page', page);

      const response = await api.get(`/category${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);

      let categoriesData = [];
      if (Array.isArray(response.data.data)) {
        categoriesData = response.data.data;
        setPagination({});
      } else if (Array.isArray(response.data.data?.data)) {
        categoriesData = response.data.data.data;
        setPagination(response.data.data);
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
        setPagination({});
      }

      console.log('Final categories data:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Không thể tải danh sách danh mục");
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const [newCategory, setNewCategory] = useState({
    name: "",
    status: "1",
  });

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    categoryId: null,
    title: '',
    message: ''
  });

  const handleEditCategory = (categoryId) => {
    if (!Array.isArray(categories)) return;
    const categoryToEdit = categories.find(
      (category) => category.id === categoryId
    );
    setNewCategory({
      ...categoryToEdit,
      status: categoryToEdit.status?.toString() || "1"
    });
    setEditingCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || newCategory.name.trim() === "") {
      toast.error("Tên danh mục không được rỗng");
      return;
    }
    console.log('Saving category:', newCategory);
    try {
      if (editingCategoryId) {
        const response = await api.put(`/category/${editingCategoryId}`, newCategory);
        if(response?.data?.status === 200) {
          const successMessage = response?.data?.message || "Cập nhật danh mục thành công!";
          toast.success(successMessage);
        }else {
          toast.success("Cập nhật danh mục thất bại!");
        }
      } else {
        const response = await api.post('/category', newCategory);
        if(response?.data?.status === 201) {
          const successMessage = response?.data?.message || "Thêm danh mục thành công!";
          toast.success(successMessage);
        }else {
          toast.success("Thêm danh mục thất bại!");
        }
      }

      await fetchCategories();

      setIsModalOpen(false);
      setNewCategory({ name: "", status: "1" });
      setEditingCategoryId(null);
    } catch (error) {
      console.error(
        "Error saving category:",
        error.response?.data || error.message
      );
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra khi lưu danh mục: ";

      if (resp) {
        if (resp.message) {
          errMsg += resp.message;
        } else if (typeof resp.error === "string") {
          errMsg += resp.error;
        } else if (resp.error && typeof resp.error === "object") {
          const flattened = [].concat(...Object.values(resp.error)).join(", ");
          errMsg += flattened || JSON.stringify(resp.error);
        } else if (resp.errors && typeof resp.errors === "object") {
          const flattened = [].concat(...Object.values(resp.errors)).join(", ");
          errMsg += flattened;
        } else {
          errMsg += JSON.stringify(resp);
        }
      } else {
        errMsg += error.message || JSON.stringify(error);
      }

      toast.error(errMsg);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setConfirmDialog({
      isOpen: true,
      categoryId,
      title: 'Xác nhận xóa danh mục',
      message: `Bạn có chắc chắn muốn xóa danh mục "${category?.name || 'này'}"? Hành động này không thể hoàn tác.`
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/category/${confirmDialog.categoryId}`);
      if (Array.isArray(categories)) {
        setCategories(
          categories.filter((category) => category.id !== confirmDialog.categoryId)
        );
      }
      toast.success("Xóa danh mục thành công!");
      setConfirmDialog({ isOpen: false, categoryId: null, title: '', message: '' });
    } catch (error) {
      console.error("Error deleting category:", error.response?.data || error.message);
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra khi xóa: ";

      if (resp) {
        if (resp.message) {
          errMsg += resp.message;
        } else if (typeof resp.error === "string") {
          errMsg += resp.error;
        } else if (resp.error && typeof resp.error === "object") {
          const flattened = [].concat(...Object.values(resp.error)).join(", ");
          errMsg += flattened || JSON.stringify(resp.error);
        } else if (resp.errors && typeof resp.errors === "object") {
          const flattened = [].concat(...Object.values(resp.errors)).join(", ");
          errMsg += flattened;
        } else {
          errMsg += JSON.stringify(resp);
        }
      } else {
        errMsg += error.message || JSON.stringify(error);
      }

      toast.error(errMsg);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, categoryId: null, title: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const fields = {
    name: 'name',
    status: 'status',
    actions: 'pattern.modified',
  };

  const listTitle = {
    name: 'Tên danh mục',
    status: 'Trạng thái',
    actions: 'Tùy biến',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý danh mục</h1>
            <p className="text-gray-600">Quản lý các danh mục sản phẩm của cửa hàng</p>
          </div>
          <button
            onClick={() => {
              setNewCategory({ name: "", status: "1" });
              setEditingCategoryId(null);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Thêm danh mục
          </button>
        </div>

        <div className="mb-6">
          <SearchInput
            searchFields={[
              {
                key: 'search',
                label: 'Tên sản phẩm',
                type: 'text',
                placeholder: 'Nhập tên sản phẩm...'
              },
              {
                key: 'status',
                label: 'Trạng thái',
                type: 'select',
                placeholder: 'Chọn trạng thái...',
                options: [
                  { value: '1', label: 'Đang hoạt động' },
                  { value: '0', label: 'Không hoạt động' }
                ]
              }
            ]}
            onSearch={(filters) => {
              const updatedFilters = { ...filters };
              if (!updatedFilters.status) {
                updatedFilters.status = 'all';
              }
              setCurrentPage(1);
              setSearchFilters(updatedFilters);
            }}
            size="medium"
            useSearchButton={true}
            showClearButton={false}
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
                    onClick={fetchCategories}
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
                      <FaEdit className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(categories) ? categories.length : 0}</p>
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
                        {Array.isArray(categories) ? categories.filter(cat => cat.status === 1).length : 0}
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
                        {Array.isArray(categories) ? categories.filter(cat => cat.status !== 1).length : 0}
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
                items={categories}
                showIndex={true}
                indexByOrder={true}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                listTitle={listTitle}
              />
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

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingCategoryId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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

                  <form onSubmit={handleSaveCategory} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên danh mục
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newCategory.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên danh mục"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={newCategory.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1">Hoạt động</option>
                        <option value="0">Không hoạt động</option>
                      </select>
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
                        {editingCategoryId ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default memo(CategoryManageList);