import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const Slidebar = () => {
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const dropdownRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileError("Không thể tải thông tin người dùng");
        // Set default profile data if API fails
        setUserProfile({
          name: "Admin User",
          email: "admin@example.com",
          avatar: null
        });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    navigate("/admin/profile");
    setIsProfileDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", null);
    window.location.href = "/";
    console.log('Logout user');
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "🏠",
    },
    {
      title: "Quản lý đơn hàng",
      items: [
        { title: "Danh sách đơn hàng", href: "/admin/order-list" },
        // { title: "Đơn hàng mới", href: "/admin/order-add" },
      ],
    },
    {
      title: "Quản lý sản phẩm",
      items: [
        { title: "Danh sách sản phẩm", href: "/admin/product-list" },
        // { title: "Thêm sản phẩm mới", href: "/admin/product-add" },
      ],
    },
    {
      title: "Quản lý danh mục",
      items: [
        { title: "Danh sách danh mục", href: "/admin/category-list" },
        // { title: "Thêm danh mục mới", href: "/admin/category-add" },
      ],
    },
    {
      title: "Quản lý tài khoản",
      items: [
        { title: "Danh sách tài khoản", href: "/admin/account-list" },
        // { title: "Thêm tài khoản mới", href: "/admin/account-add" },
      ],
    },
    {
      title: "Upload Ảnh",
      href: "/upload-demo",
      icon: "📤",
    },
  ];

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-lg h-full py-6 px-4 font-sans overflow-auto flex flex-col">
      {/* Profile Section */}
      <div className="mb-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
            disabled={profileLoading}
          >
            <div className="flex items-center flex-1">
              {profileLoading ? (
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse mr-3"></div>
              ) : userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  {getUserInitials(userProfile?.name)}
                </div>
              )}
              <div className="text-left">
                {profileLoading ? (
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-300 rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-32"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-800">
                      {userProfile?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userProfile?.email || "admin@example.com"}
                    </p>
                  </>
                )}
              </div>
            </div>
            {!profileLoading && (
              <FaChevronDown
                className={`text-gray-500 transition-transform duration-200 ${
                  isProfileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left"
                >
                  <FaUser className="mr-3 text-gray-500" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-left"
                >
                  <FaCog className="mr-3 text-gray-500" />
                  Cài đặt
                </button>
                <hr className="my-2" />
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left"
                >
                  <FaSignOutAlt className="mr-3" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <a
                href={item.href}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-lg block rounded-lg px-4 py-3 transition-all duration-200 font-medium"
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </a>
            ) : (
              <div>
                <h6 className="text-blue-600 text-lg font-bold px-4 py-2 mt-4 mb-2">
                  {item.title}
                </h6>
                <ul className="ml-4 space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href={subItem.href}
                        className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-sm block rounded px-4 py-2 transition-all duration-200"
                      >
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Slidebar;
