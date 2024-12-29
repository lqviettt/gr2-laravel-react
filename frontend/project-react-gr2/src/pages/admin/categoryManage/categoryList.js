import React, { useState, useEffect } from "react";
import { memo } from "react";
import "./style.scss";

const CategoryManageList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:9000/api/category`);
        const result = await response.json();
        if (result?.data?.data) {
          setCategories(result.data.data);
        } else {
          console.error("Dữ liệu không hợp lệ:", result);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h1>Category List</h1>
      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.status}</td>
              <td>
                <button type="submit">DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(CategoryManageList);
