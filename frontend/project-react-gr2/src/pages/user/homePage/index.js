import { memo, useEffect, useState } from "react";
import slider1 from "../../../assets/images/slider1.webp";
import slider2 from "../../../assets/images/banner.jpg";
import product14 from "../../../assets/images/14promax256.webp";
import phukien from "../../../assets/images/phukien.webp";
import pindlchuan from "../../../assets/images/pineudlchuan.webp";
import pindlcao from "../../../assets/images/pineudlcao.webp";
import "./style.scss";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:9000/api/product?page=${page}&perPage=4`
        );
        const result = await response.json();
        if (result?.data?.data) {
          setProducts(result.data.data);
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
    <content className="hd">
      <div className="banner">
        <img
          src={slider2}
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
            <div>
              <a
                href={`/product?search=iphone&perPage=15`}
                className="category-item"
              >
                <img src={product14} alt="Dien Thoai"></img>
                <p>iPhone</p>
              </a>
            </div>
            <div>
              <a
                href={`/product?search=cap%20sac&search=tai%20nghe&perPage=15`}
                className="category-item"
              >
                <img src={phukien} alt="Dien Thoai"></img>
                <p>Phụ kiện</p>
              </a>
            </div>
            <div>
              <a href={`/product-detail/26`} className="category-item">
                <img src={pindlchuan} alt="Dien Thoai"></img>
                <p>Pin EU dung lượng chuẩn</p>
              </a>
            </div>
            <div>
              <a
                href={`/category?search=iphone&perPage=15`}
                className="category-item"
              >
                <img src={pindlcao} alt="Dien Thoai"></img>
                <p>Pin EU dung lượng cao</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="featured-categories">
          <h2>iPhone</h2>
          <div className="categories-list">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div>
                  <a
                    href={`/product-detail/${product.id}`}
                    className="category-item"
                    key={product.id}
                  >
                    <img src={product14} alt="Dien Thoai"></img>
                    <p>{product.name}</p>
                    <p>Price: {product.price}.000đ</p>
                  </a>
                </div>
              ))
            ) : (
              <p>Không có danh mục nào.</p>
            )}
            <div className="pagination">
              <div className="pagination">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &laquo; Trước
                </button>
                <span>Trang {currentPage}</span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={products.length === 0}
                >
                  Sau &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </content>
  );
};

export default memo(HomePage);
