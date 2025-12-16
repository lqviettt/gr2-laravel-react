import React, { useEffect, useState, memo } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CommonTable from "../../../components/CommonTable";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SearchInput from "../../../components/SearchInput";
import Pagination from "../../../components/Pagination";
import { FaPlus, FaUsers, FaCheckCircle, FaTimesCircle, FaShieldAlt } from "react-icons/fa";

const AccountList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [newAccount, setNewAccount] = useState({
    name: "",
    user_name: "",
    email: "",
    password: "",
    is_admin: false,
  });

  const [editingAccountId, setEditingAccountId] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    accountId: null,
    title: '',
    message: ''
  });
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const fields = {
    name: 'name',
    user_name: 'user_name',
    email: 'email',
    is_admin: 'is_admin',
    created_at: 'created_at',
    actions: 'pattern.modified',
  };

  const listTitle = {
    name: 'Họ tên',
    user_name: 'Tên tài khoản',
    email: 'Email',
    is_admin: 'Loại tài khoản',
    created_at: 'Ngày tạo',
    actions: 'Tùy biến',
  };

  const fetchAccounts = async (filters = {}, page = currentPage) => {
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

      const response = await api.get(`/admin/account${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);

      const accountsList = response.data.data.data || [];
      const paginationData = response.data.data;
      setPagination(paginationData);

      const transformedAccounts = accountsList.map(account => ({
        id: account.id,
        name: account.name || '',
        user_name: account.user_name || '',
        email: account.email || '',
        is_admin: account.is_admin ? 'Admin' : 'Người dùng',
        is_admin_value: account.is_admin,
        created_at: new Date(account.created_at).toLocaleDateString('vi-VN'),
      }));

      setAccounts(transformedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Không thể tải danh sách tài khoản");
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(searchFilters, currentPage);
  }, [searchFilters, currentPage]);

  const handleEditAccount = (accountId) => {
    if (loadingEdit) return;

    console.log('Editing accountId:', accountId);
    const accountToEdit = accounts.find((account) => account.id === accountId);
    console.log('accountToEdit:', accountToEdit);

    if (accountToEdit) {
      setLoadingEdit(true);
      fetchAccountDetails(accountId);
    } else {
      console.log('accountId not found in accounts');
      setLoadingEdit(true);
      fetchAccountDetails(accountId);
    }
  };

  const fetchAccountDetails = async (accountId) => {
    try {
      console.log('Fetching account details for ID:', accountId);
      const response = await api.get(`/admin/account/${accountId}`);
      const account = response.data.data;
      console.log('Fetched account:', account);

      setNewAccount({
        name: account.name || "",
        user_name: account.user_name || "",
        email: account.email || "",
        password: "",
        is_admin: account.is_admin || false,
      });
      setEditingAccountId(accountId);
      console.log('Set editing account ID to:', accountId);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching account details:", error);
      toast.error("Không thể tải thông tin tài khoản: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      const accountData = {
        name: newAccount.name,
        user_name: newAccount.user_name,
        email: newAccount.email,
        is_admin: newAccount.is_admin,
      };

      // Chỉ thêm password nếu đó là tạo mới hoặc nếu người dùng nhập password mới
      if (!editingAccountId || newAccount.password) {
        if (!newAccount.password || newAccount.password.trim() === "") {
          toast.error("Vui lòng nhập mật khẩu");
          return;
        }
        accountData.password = newAccount.password;
      }

      if (editingAccountId) {
        console.log('Updating account:', accountData);
        const updateResponse = await api.put(`/admin/account/${editingAccountId}`, accountData);
        if (updateResponse?.data?.status === 200) {
          const successMessage = updateResponse?.data?.message || "Cập nhật tài khoản thành công!";
          toast.success(successMessage);
          await fetchAccounts(searchFilters, currentPage);
        } else {
          const errorMessage = updateResponse?.data?.error || "Cập nhật tài khoản không thành công!";
          toast.error(errorMessage);
        }
      } else {
        if (!newAccount.password || newAccount.password.trim() === "") {
          toast.error("Vui lòng nhập mật khẩu");
          return;
        }
        console.log('Creating account:', accountData);
        const createResponse = await api.post('/admin/account', accountData);
        if (createResponse?.data?.status === 201) {
          const successMessage = createResponse?.data?.message || "Thêm tài khoản thành công!";
          toast.success(successMessage);
          await fetchAccounts(searchFilters, currentPage);
        } else {
          const errorMessage = createResponse?.data?.error || "Thêm tài khoản không thành công!";
          toast.error(errorMessage);
        }
      }

      setIsModalOpen(false);
      setNewAccount({
        name: "",
        user_name: "",
        email: "",
        password: "",
        is_admin: false,
      });
      setEditingAccountId(null);
    } catch (error) {
      console.error("Error saving account:", error.response?.data || error.message);
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra: ";

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

  const handleDeleteAccount = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) {
      toast.error("Không tìm thấy tài khoản để xóa");
      return;
    }
    setConfirmDialog({
      isOpen: true,
      accountId: accountId,
      title: 'Xác nhận xóa tài khoản',
      message: `Bạn có chắc chắn muốn xóa tài khoản "${account?.name || 'này'}"? Hành động này không thể hoàn tác.`
    });
  };

  const handleConfirmDelete = async () => {
    try {
      const deleteResponse = await api.delete(`/admin/account/${confirmDialog.accountId}`);
      if (deleteResponse?.data?.status === 200) {
        const successMessage = deleteResponse?.data?.message || "Xóa tài khoản thành công!";
        toast.success(successMessage);
        await fetchAccounts(searchFilters, currentPage);
        setConfirmDialog({ isOpen: false, accountId: null, title: '', message: '' });
      } else {
        const errorMessage = deleteResponse?.data?.error || "Xóa tài khoản không thành công!";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting account:", error.response?.data || error.message);
      const resp = error.response?.data;
      let errMsg = "Có lỗi xảy ra khi xóa tài khoản: ";

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
    setConfirmDialog({ isOpen: false, accountId: null, title: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setNewAccount({ ...newAccount, [name]: checked });
    } else {
      setNewAccount({ ...newAccount, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài khoản</h1>
            <p className="text-gray-600">Quản lý các tài khoản trong hệ thống</p>
          </div>
          <button
            onClick={() => {
              setNewAccount({
                name: "",
                user_name: "",
                email: "",
                password: "",
                is_admin: false,
              });
              setEditingAccountId(null);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Thêm tài khoản
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <SearchInput
            searchFields={[
              {
                key: 'search',
                label: 'Tên hoặc Email',
                type: 'text',
                placeholder: 'Nhập tên hoặc email...'
              },
              {
                key: 'status',
                label: 'Loại tài khoản',
                type: 'select',
                placeholder: 'Chọn loại tài khoản...',
                options: [
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'Người dùng' }
                ]
              },
            ]}
            onSearch={(filters) => {
              const updatedFilters = { ...filters };
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
                    onClick={() => fetchAccounts(searchFilters, currentPage)}
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
                      <FaUsers className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tổng tài khoản</p>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(accounts) ? accounts.length : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <FaShieldAlt className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Tài khoản Admin</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(accounts) ? accounts.filter(account => account.is_admin_value === true).length : 0}
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
                      <p className="text-sm font-medium text-gray-600">Người dùng</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Array.isArray(accounts) ? accounts.filter(account => account.is_admin_value !== true).length : 0}
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
                items={accounts}
                showIndex={true}
                indexByOrder={true}
                onEdit={handleEditAccount}
                onDelete={handleDeleteAccount}
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

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:max-w-2xl w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingAccountId ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <form onSubmit={handleSaveAccount} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newAccount.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập họ tên"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Tên tài khoản
                        </label>
                        <input
                          type="text"
                          name="user_name"
                          value={newAccount.user_name}
                          onChange={handleInputChange}
                          disabled={!!editingAccountId}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${editingAccountId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          placeholder="Nhập tên tài khoản"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={newAccount.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập email"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Mật khẩu {editingAccountId ? '(để trống nếu không thay đổi)' : '(bắt buộc)'}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={newAccount.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={editingAccountId ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"}
                          required={!editingAccountId}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_admin"
                            checked={newAccount.is_admin}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Cấp quyền Admin cho tài khoản này
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {editingAccountId ? 'Cập nhật' : 'Thêm mới'}
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

export default memo(AccountList);
