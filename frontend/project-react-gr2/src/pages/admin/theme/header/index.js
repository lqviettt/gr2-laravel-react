import React from "react";
import "./style.scss";
import { IoLogIn } from "react-icons/io5";

const Header = () => {
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", null);
    window.location.href = "/";
  };

  return (
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <IoLogIn size={25} className="text-white" />
              <span className="mt-2">Đăng xuất</span>
            </button>{" "}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
