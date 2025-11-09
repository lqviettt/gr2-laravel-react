import React, { useEffect, useState, memo } from "react";
import { Section, LoadingSpinner, ErrorMessage } from "../../../component/user";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const userData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải thông tin tài khoản");
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    userData();
  }, []);

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
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Thông tin cá nhân
                  </h3>
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
                </div>

                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                    Tài khoản
                  </h3>
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
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
                  Chỉnh sửa thông tin
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default memo(ProfilePage);
