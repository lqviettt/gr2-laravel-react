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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const [selectedImage, setSelectedImage] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      if (search) {
        try {
          const response = await fetch(
            `http://127.0.0.1:9000/api/product?search=${search}&perPage=16&page=${page}`
          );
          const result = await response.json();
          if (result && Array.isArray(result.data.data)) {
            setProducts(result.data.data);
            const categoryId = result.data.category_id || "";
            const images = productImages[categoryId] || [];
            if (images.length > 0) {
              setSelectedImage(images[0].src);
            }
          } else {
            console.log("No products found for this category.");
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        console.log("No search query found in URL");
      }
    };

    fetchProducts(currentPage);
  }, [search, currentPage]);

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="content">
      <div className="featured-categories">
        <h1 className="title-page">
          <span>ĐIỆN THOẠI</span>
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
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
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
                  <p>{product.name}</p>
                  <p>Price: {product.price}.000đ</p>
                </a>
              </div>
            ))
          ) : (
            <p>Không có danh mục nào.</p>
          )}
        </div>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
  );
};

export default memo(ProductsPage);
