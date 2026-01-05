import React, { useEffect, useState, memo } from "react";
import { api } from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaUser, FaLock, FaCheckCircle, FaClock, FaShieldAlt } from "react-icons/fa";

const AdminProfile = () => {
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
      const response = await api.put(`/profile`, {
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
      await api.post('/change-password', {
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold mb-4">Lỗi</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Hồ Sơ Quản Trị Viên</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">
                    {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <FaCheckCircle className="text-lg" />
                    <span className="text-sm font-medium">Tài khoản Hoạt Động</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <FaShieldAlt className="text-lg" />
                    <span className="text-sm font-medium">Quyền Quản Trị</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={handleEditClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaUser className="text-sm" />
                    Chỉnh Sửa Thông Tin
                  </button>
                  <button
                    onClick={handleChangePasswordClick}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <FaLock className="text-sm" />
                    Đổi Mật Khẩu
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-xl text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Thông Tin Cá Nhân</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ Tên</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <p className="text-gray-900 font-medium">{user?.name}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Đăng Nhập</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <p className="text-gray-900 font-medium">{user?.user_name}</p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <p className="text-gray-900 font-medium break-all">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaShieldAlt className="text-xl text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Thông Tin Tài Khoản</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vai Trò</label>
                  <div className="bg-gray-50 border-2 border-red-300 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👨‍💼</span>
                      <span className="text-gray-900 font-bold">Quản Trị Viên</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng Thái</label>
                  <div className="bg-gray-50 border-2 border-green-300 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-gray-900 font-bold">Hoạt Động</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày Tạo Tài Khoản</label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-600" />
                      <span className="text-gray-900 font-medium">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Xác Minh Email</label>
                  <div className="bg-gray-50 border-2 border-blue-300 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✓</span>
                      <span className="text-gray-900 font-bold">Đã Xác Minh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <FaClock className="text-xl text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Hoạt Động Gần Đây</h3>
              </div>
              <p className="text-gray-700">
                Lần đăng nhập cuối cùng: <span className="font-semibold">Hôm nay</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUser />
                Chỉnh Sửa Thông Tin
              </h3>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Họ Tên</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên Đăng Nhập</label>
                <input
                  type="text"
                  name="user_name"
                  value={editFormData.user_name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-semibold">{editError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {editLoading ? "Đang cập nhật..." : "Cập Nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaLock />
                Đổi Mật Khẩu
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật Khẩu Cũ</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordFormData.old_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mật Khẩu Mới</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordFormData.new_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {passwordFormData.new_password && passwordFormData.new_password.length < 6 && (
                  <p className="text-xs text-yellow-600 mt-1 font-semibold">
                    ⚠️ Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Xác Nhận Mật Khẩu</label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={passwordFormData.new_password_confirmation}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                {passwordFormData.new_password_confirmation && 
                  passwordFormData.new_password !== passwordFormData.new_password_confirmation && (
                  <p className="text-xs text-red-600 mt-1 font-semibold">
                    ❌ Mật khẩu không trùng khớp
                  </p>
                )}
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-semibold">{passwordError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setChangePasswordModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition"
                >
                  {passwordLoading ? "Đang cập nhật..." : "Đổi Mật Khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AdminProfile);
