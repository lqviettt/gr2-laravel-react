import React, { useState } from "react";

const Slidebar = () => {
  return (
    <nav className="bg-white shadow-lg h-screen min-w-[240px] py-6 px-4 font-[sans-serif] overflow-auto">
      <ul>
        <li>
          <a
            href="/admin"
            className="text-black hover:text-blue-600 text-[20px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
          >
            Dashboard
          </a>
        </li>
      </ul>

      <div className="mt-4">
        <h6 className="text-blue-600 text-lg font-bold px-4">
          Quản lý đơn hàng
        </h6>
        <ul className="mt-2">
          <li>
            <a
              href="/admin/order-list"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Danh sách đơn hàng
            </a>
          </li>
          <li>
            <a
              href="/admin/order-add"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Đơn hàng mới
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <h6 className="text-blue-600 text-lg font-bold px-4">
          Quản lý sản phẩm
        </h6>
        <ul className="mt-2">
          <li>
            <a
              href="/admin/product-list"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Danh sách sản phẩm
            </a>
          </li>
          <li>
            <a
              href="/admin/product-add"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Thêm sản phẩm mới
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <h6 className="text-blue-600 text-lg font-bold px-4">
          Quản lý danh mục
        </h6>
        <ul className="mt-2">
          <li>
            <a
              href="/admin/category-list"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Danh sách danh mục
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Thêm danh mục mới
            </a>
          </li>
        </ul>
      </div>
      <div className="mt-4">
        <h6 className="text-blue-600 text-lg font-bold px-4">
          Quản lý nhân viên
        </h6>
        <ul className="mt-2">
          <li>
            <a
              href="javascript:void(0)"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Danh sách nhân viên
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className="text-black hover:text-blue-600 text-[15px] block hover:bg-blue-50 rounded px-4 py-2.5 transition-all"
            >
              Thêm nhân viên mới
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Slidebar;
