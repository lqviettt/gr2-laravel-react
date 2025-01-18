import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import "./style.scss";
import ip12 from "../../../assets/images/ip12.webp";
import ip12Pro from "../../../assets/images/ip12-pro.webp";
import ip13 from "../../../assets/images/ip13.webp";
import ip13Pro from "../../../assets/images/ip13-pro.webp";
import ip14 from "../../../assets/images/ip14.webp";
import ip14Pro from "../../../assets/images/ip14-pro.webp";
import ip15 from "../../../assets/images/ip15.webp";
import ip15Pro from "../../../assets/images/ip15-pro.webp";
import ip16 from "../../../assets/images/ip16.webp";
import ip16Pro from "../../../assets/images/ip16-pro.webp";

const productImages = {
  1: [{ id: 1, src: ip12, alt: "iPhone 12" }],
  6: [{ id: 1, src: ip12Pro, alt: "iPhone 12 Pro" }],
  11: [{ id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" }],
  2: [{ id: 1, src: ip13, alt: "iPhone 13" }],
  7: [{ id: 1, src: ip13Pro, alt: "iPhone 13 Pro" }],
  12: [{ id: 1, src: ip13Pro, alt: "iPhone 13 Pro Max" }],
  3: [{ id: 1, src: ip14, alt: "iPhone 14" }],
  8: [{ id: 1, src: ip14Pro, alt: "iPhone 14 Pro" }],
  13: [{ id: 1, src: ip14Pro, alt: "iPhone 14 Pro Max" }],
  4: [{ id: 1, src: ip15, alt: "iPhone 15" }],
  9: [{ id: 1, src: ip15Pro, alt: "iPhone 15 Pro" }],
  14: [{ id: 1, src: ip15Pro, alt: "iPhone 15 Pro Max" }],
  5: [{ id: 1, src: ip16, alt: "iPhone 16" }],
  10: [{ id: 1, src: ip16Pro, alt: "iPhone 16 Pro" }],
  15: [{ id: 1, src: ip16Pro, alt: "iPhone 16 Pro Max" }],
};

const ProductList = () => {
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
          const images = productImages[categoryId] || [];
          if (images.length > 0) {
            setSelectedImage(images[0].src);
          }
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

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="content mt-5">
      <div className="featured-categories">
        <h1 className="title-page">
          <span>
            {categoryId && productImages[categoryId]
              ? productImages[categoryId][0].alt
              : "Danh mục sản phẩm"}
          </span>
        </h1>
        <h2 className="sort-title">
          <FaSortAmountDown />
          <span>Xếp theo: </span>
        </h2>
        <div className="sort-buttons">
          <button onClick={() => handleSort("asc")}>Giá thấp đến cao</button>
          <button onClick={() => handleSort("desc")}>Giá cao xuống thấp</button>
        </div>
        <div className="categories-list">
          {sortedProducts.map((product) => (
            <div key={product.id}>
              <a
                href={`/product-detail/${product.id}`}
                className="category-item"
              >
                {(productImages[product.category_id] || []).map((image) => (
                  <img
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                    onClick={() => setSelectedImage(image.src)}
                    className={selectedImage === image.src ? "active" : ""}
                  />
                ))}
                <div className="text-left text-xl font-semibold w-4/5">
                  <p>{product.name}</p>
                  <p className="mt-5 text-red-500">
                    {formatCurrency(product.price * 1000)}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductList);
