import React from "react";
import Header from "../header/index.js";
import Slidebar from "../slidebar/index.js";
import "./style.scss";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="admin-layout">
        <Slidebar />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
