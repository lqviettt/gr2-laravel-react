import { Link } from "react-router-dom";
import "./style.scss";
import React, { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const Slidebar = () => {
  const [isSubmenuVisible, setSubmenuVisible] = useState(false);
  const [isSubmenuVisible1, setSubmenuVisible1] = useState(false);
  const [isSubmenuVisible2, setSubmenuVisible2] = useState(false);
  const [isSubmenuVisible3, setSubmenuVisible3] = useState(false);

  const toggleSubmenu1 = () => {
    setSubmenuVisible1(!isSubmenuVisible1);
  };

  const toggleSubmenu2 = () => {
    setSubmenuVisible2(!isSubmenuVisible2);
  };

  const toggleSubmenu3 = () => {
    setSubmenuVisible3(!isSubmenuVisible3);
  };

  const toggleSubmenu = () => {
    setSubmenuVisible(!isSubmenuVisible);
  };

  return (
    <div className="slidebar">
      <ul>
        <li>
          <Link to="/admin">Dashboard</Link>
        </li>
        <li className="menu-item">
          <a href="#" onClick={toggleSubmenu1}>
            Category
            <MdArrowDropDown />
          </a>
          {isSubmenuVisible1 && (
            <ul className="submenu">
              <li>
                <a href="/admin/category-add">Add Category</a>
              </li>
              <li>
                <a href="/admin/category-list">List Category</a>
              </li>
            </ul>
          )}
        </li>
        <li className="menu-item">
          <a href="#" onClick={toggleSubmenu2}>
            Product
            <MdArrowDropDown />
          </a>
          {isSubmenuVisible2 && (
            <ul className="submenu">
              <li>
                <a href="/admin/product-add">Add Product</a>
              </li>
              <li>
                <a href="/admin/product-list">List Product</a>
              </li>
            </ul>
          )}
        </li>
        <li className="menu-item">
          <a href="#" onClick={toggleSubmenu3}>
            Employee
            <MdArrowDropDown />
          </a>
          {isSubmenuVisible3 && (
            <ul className="submenu">
              <li>
                <a href="/admin/employee-add">Add Employee</a>
              </li>
              <li>
                <a href="/admin/employee-list">List Employee</a>
              </li>
            </ul>
          )}
        </li>
        <li className="menu-item">
          <a href="#" onClick={toggleSubmenu}>
            Order
            <MdArrowDropDown />
          </a>
          {isSubmenuVisible && (
            <ul className="submenu">
              <li>
                <a href="/admin/order-add">Add Order</a>
              </li>
              <li>
                <a href="/admin/order-list">List Order</a>
              </li>
            </ul>
          )}
        </li>
        {/* <li>
          <a href="/admin/product-manage">Product</a>
        </li>
        <li>
          <a href="/admin/employee-manage">Employee</a>
        </li>
        <li>
          <a href="/admin/order-manage">Order</a>
        </li> */}
      </ul>
    </div>
  );
};

export default Slidebar;
