import React from "react";
import { IoLogIn, IoMenu } from "react-icons/io5";

const Header = ({ onMenuClick }) => {
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden mr-4 text-gray-600 hover:text-gray-800"
        >
          <IoMenu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;
