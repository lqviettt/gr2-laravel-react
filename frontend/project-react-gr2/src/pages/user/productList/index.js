import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.scss";

const ProductList = () => {
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:9000/api/product?category_id=${categoryId}`
        );
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ API");
        }
        const result = await response.json();
        if (result?.data.data) {
          setProducts(result.data.data);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    } else {
      setLoading(false);
    }
  }, [categoryId]);

  if (loading) {
    return <p>Đang tải danh sách sản phẩm...</p>;
  }

  if (error) {
    return <div className="error">Đã xảy ra lỗi: {error}</div>;
  }

  if (!products.length) {
    return <p>Không có sản phẩm nào trong danh mục này.</p>;
  }

  return (
    <div className="featured-products">
      {/* <h2>Sản phẩm thuộc danh mục {search}</h2> */}
      <div className="product-list">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div>
              <a
                href={`/product-detail/${product.id}`}
                className="product-item"
                key={product.id}
              >
                <p>Name: {product.name}</p>
                <p>Gia: {product.price}</p>
                <p>category_id: {product.category_id}</p>
              </a>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm trong danh mục này.</p>
        )}
      </div>
    </div>
  );
};

export default memo(ProductList);
