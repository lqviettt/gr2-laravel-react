import React from "react";
import Header from "../header/index.js";
import Slidebar from "../slidebar/index.js";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <div>
        <Header />
      </div>
      <div className="flex flex-row">
        <div className="bottom-[100px]" style={{ width: "250px" }}>
          <Slidebar />
        </div>
        <div className="ml-10">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
