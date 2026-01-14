import React, { useEffect, useState, memo } from "react";
import { Section, LoadingSpinner, ErrorMessage } from "../../../component/user";
import { UserAvatar, InfoCard, Button } from "../../../components";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    user_name: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  
  // Change password state
  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile');
      const data = response.data;
      setUser(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit profile
  const handleEditClick = () => {
    setEditFormData({
      name: user.name,
      email: user.email,
      user_name: user.user_name,
    });
    setEditError("");
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");

    // Validation
    if (!editFormData.name.trim()) {
      setEditError("Vui lòng nhập họ tên");
      return;
    }
    if (!editFormData.email.trim()) {
      setEditError("Vui lòng nhập email");
      return;
    }
    if (!editFormData.user_name.trim()) {
      setEditError("Vui lòng nhập tên đăng nhập");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email);
    if (!isValidEmail) {
      setEditError("Email không hợp lệ");
      return;
    }

    setEditLoading(true);
    try {
      const response = await api.put(`/user/${user.id}`, {
        name: editFormData.name,
        email: editFormData.email,
        user_name: editFormData.user_name,
      });
      
      setUser(response.data.data || response.data);
      toast.success("Cập nhật thông tin thành công!");
      setEditModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Có lỗi xảy ra";
      setEditError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle change password
  const handleChangePasswordClick = () => {
    setPasswordFormData({
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPasswordError("");
    setChangePasswordModalOpen(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validation
    if (!passwordFormData.old_password) {
      setPasswordError("Vui lòng nhập mật khẩu cũ");
      return;
    }
    if (!passwordFormData.new_password) {
      setPasswordError("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (passwordFormData.new_password.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    if (passwordFormData.new_password !== passwordFormData.new_password_confirmation) {
      setPasswordError("Mật khẩu xác nhận không trùng khớp");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await api.post('/change-password', {
        old_password: passwordFormData.old_password,
        new_password: passwordFormData.new_password,
        new_password_confirmation: passwordFormData.new_password_confirmation,
      });
      
      toast.success("Đổi mật khẩu thành công!");
      setChangePasswordModalOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Có lỗi xảy ra";
      setPasswordError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner message="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 sm:py-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center">
                Thông tin tài khoản
              </h1>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <UserAvatar
                  name={user.name}
                  size="xl"
                  className="ring-4 ring-white shadow-lg"
                />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoCard title="Thông tin cá nhân">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-gray-600 font-medium">Họ tên:</span>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="font-medium text-gray-800 break-all">{user.email}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-gray-600 font-medium">Tên đăng nhập:</span>
                      <span className="font-medium text-gray-800">{user.user_name || 'N/A'}</span>
                    </div>
                  </div>
                </InfoCard>

                <InfoCard title="Tài khoản">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-gray-600 font-medium">Trạng thái:</span>
                      <span className="font-medium text-green-600">Hoạt động</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-gray-600 font-medium">Ngày tạo:</span>
                      <span className="font-medium text-gray-800">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </InfoCard>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa thông tin
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={handleChangePasswordClick}
                >
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Edit Info Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 opacity-75"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Chỉnh sửa thông tin
                  </h3>
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      name="user_name"
                      value={editFormData.user_name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {editError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{editError}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {editLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 opacity-75"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Đổi mật khẩu
                  </h3>
                  <button
                    onClick={() => setChangePasswordModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu cũ
                    </label>
                    <input
                      type="password"
                      name="old_password"
                      value={passwordFormData.old_password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordFormData.new_password}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {passwordFormData.new_password && passwordFormData.new_password.length < 6 && (
                      <p className="text-xs text-yellow-600 mt-1">
                        Mật khẩu phải có ít nhất 6 ký tự
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="new_password_confirmation"
                      value={passwordFormData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {passwordFormData.new_password_confirmation && 
                      passwordFormData.new_password !== passwordFormData.new_password_confirmation && (
                      <p className="text-xs text-red-600 mt-1">
                        Mật khẩu không trùng khớp
                      </p>
                    )}
                  </div>

                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{passwordError}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setChangePasswordModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {passwordLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProfilePage);
