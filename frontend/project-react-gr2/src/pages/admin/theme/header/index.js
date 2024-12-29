import React from "react";
import "./style.scss";

const Header = () => {
  return (
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <a href="/">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
