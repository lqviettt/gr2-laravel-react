import { memo, useEffect, useState } from "react";
import slider1 from "../../../assets/images/slider1.webp";
import slider2 from "../../../assets/images/banner.jpg";
import product14 from "../../../assets/images/14promax256.webp";
import phukien from "../../../assets/images/phukien.webp";
import pindlchuan from "../../../assets/images/pineudlchuan.webp";
import pindlcao from "../../../assets/images/pineudlcao.webp";
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
import "./style1.scss";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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
          const categoryId = result.data.category_id || "";
          const images = productImages[categoryId] || [];
          if (images.length > 0) {
            setSelectedImage(images[0].src);
          }
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
          <h1 className="title-pageee">
            <span>DANH MỤC NỔI BẬT</span>
          </h1>
          <div className="categories-list">
            <div>
              <a
                href={`/product?search=iphone&perPage=16`}
                className="category-item"
              >
                <img src={product14} alt="Dien Thoai"></img>
                <span>iPhone</span>
              </a>
            </div>
            <div>
              <a
                href={`/product?search=cap%20sac&search=tai%20nghe&perPage=15`}
                className="category-item"
              >
                <img src={phukien} alt="Dien Thoai"></img>
                <span>Phụ kiện</span>
              </a>
            </div>
            <div>
              <a href={`/product-detail/26`} className="category-item">
                <img src={pindlchuan} alt="Dien Thoai"></img>
                <span>Pin EU dung lượng chuẩn</span>
              </a>
            </div>
            <div>
              <a
                href={`/category?search=iphone&perPage=15`}
                className="category-item"
              >
                <img src={pindlcao} alt="Dien Thoai"></img>
                <span>Pin EU dung lượng cao</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="featured-categories">
          <h1 className="title-pageee">
            <span>iPhone</span>
          </h1>
          <div className="categories-list">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
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
            {/* <div className="pagination">
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
            </div> */}
          </div>
        </div>
      </div>
    </content>
  );
};

export default memo(HomePage);
