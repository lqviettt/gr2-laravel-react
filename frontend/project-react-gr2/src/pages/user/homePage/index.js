import { memo, useEffect, useState } from "react";
import slider1 from "../../../assets/images/slider1.webp";
import "./style.scss";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async (page = 1) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:9000/api/category?page=${page}`
        );
        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          console.error("Dữ liệu không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchCategories(currentPage);
  }, [currentPage]);

  return (
    <content className="hd">
      <div className="banner">
        <img
          src={slider1}
          alt="My React Image"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        />
      </div>
      <div className="content">
        <div className="featured-categories">
          <h2>Danh mục nổi bật</h2>
          <div className="categories-list">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div>
                  <a
                    href={`/product?category_id=${category.id}`}
                    className="category-item"
                    key={category.id}
                  >
                    <p>{category.name}</p>
                    <img src="" alt="Dien Thoai"></img>
                  </a>
                </div>
              ))
            ) : (
              <p>Không có danh mục nào.</p>
            )}
          </div>
        </div>
        <div className="featured-categories">
          <h2>Danh mục nổi bật</h2>
          <div className="categories-list">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div>
                  <a
                    href={`/product?category_id=${category.id}`}
                    className="category-item"
                    key={category.id}
                  >
                    <p>{category.name}</p>
                    <img src="" alt="Dien Thoai"></img>
                  </a>
                </div>
              ))
            ) : (
              <p>Không có danh mục nào.</p>
            )}
          </div>
        </div>
        <div className="featured-categories">
          <h2>Danh mục nổi bật</h2>
          <div className="categories-list">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div>
                  <a
                    href={`/product?category_id=${category.id}`}
                    className="category-item"
                    key={category.id}
                  >
                    <p>{category.name}</p>
                    <img src="" alt="Dien Thoai"></img>
                  </a>
                </div>
              ))
            ) : (
              <p>Không có danh mục nào.</p>
            )}
          </div>
        </div>
      </div>

      {/* <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === 21}
        >
          Next &raquo;
        </button>
      </div> */}
    </content>
  );
};

export default memo(HomePage);
