import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import ip12 from "../../../assets/images/ip12.webp";
import ip12Pro from "../../../assets/images/ip12-pro.webp";
import ip12Black from "../../../assets/images/ip12-black.webp";
import ip12White from "../../../assets/images/ip12-white.webp";
import ip12Blue from "../../../assets/images/ip12-blue.webp";
import ip12Green from "../../../assets/images/ip12-green.webp";
import ip13 from "../../../assets/images/ip13.webp";
import ip13Pro from "../../../assets/images/ip13-pro.webp";
import ip14 from "../../../assets/images/ip14.webp";
import ip14Pro from "../../../assets/images/ip14-pro.webp";
import ip15 from "../../../assets/images/ip15.webp";
import ip15Pro from "../../../assets/images/ip15-pro.webp";
import ip16 from "../../../assets/images/ip16.webp";
import ip16Pro from "../../../assets/images/ip16-pro.webp";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const productImages = {
    "iPhone 12": [
      { id: 1, src: ip12, alt: "iPhone 12" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
      { id: 5, src: ip12Green, alt: "iPhone 12 Green" },
    ],
    "iPhone 12 Pro": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
      { id: 5, src: ip12Green, alt: "iPhone 12 Green" },
    ],
    "iPhone 12 Pro Max": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
      { id: 5, src: ip12Green, alt: "iPhone 12 Green" },
    ],
    "iPhone 13": [
      { id: 1, src: ip13, alt: "iPhone 13" },
      { id: 2, src: ip13Pro, alt: "iPhone 13 Pro" },
    ],
    "iPhone 13 Pro": [
      { id: 1, src: ip13Pro, alt: "iPhone 13" },
      { id: 2, src: ip13Pro, alt: "iPhone 13 Pro" },
    ],
    "iPhone 13 Pro Max": [
      { id: 1, src: ip13Pro, alt: "iPhone 13" },
      { id: 2, src: ip13Pro, alt: "iPhone 13 Pro" },
    ],
    "iPhone 14": [
      { id: 1, src: ip14, alt: "iPhone 14" },
      { id: 2, src: ip14Pro, alt: "iPhone 14 Pro" },
    ],
    "iPhone 14 Pro": [
      { id: 1, src: ip14Pro, alt: "iPhone 14" },
      { id: 2, src: ip14Pro, alt: "iPhone 14 Pro" },
    ],
    "iPhone 14 Pro Max": [
      { id: 1, src: ip14Pro, alt: "iPhone 14" },
      { id: 2, src: ip14Pro, alt: "iPhone 14 Pro" },
    ],
    "iPhone 15": [
      { id: 1, src: ip15, alt: "iPhone 15" },
      { id: 2, src: ip15Pro, alt: "iPhone 15 Pro" },
    ],
    "iPhone 15 Pro": [
      { id: 1, src: ip15Pro, alt: "iPhone 15" },
      { id: 2, src: ip15Pro, alt: "iPhone 15 Pro" },
    ],
    "iPhone 15 Pro Max": [
      { id: 1, src: ip15Pro, alt: "iPhone 15" },
      { id: 2, src: ip15Pro, alt: "iPhone 15 Pro" },
    ],
    "iPhone 16": [
      { id: 1, src: ip16, alt: "iPhone 16" },
      { id: 2, src: ip16Pro, alt: "iPhone 16 Pro" },
    ],
    "iPhone 16 Pro": [
      { id: 1, src: ip16Pro, alt: "iPhone 16" },
      { id: 2, src: ip16Pro, alt: "iPhone 16 Pro" },
    ],
    "iPhone 16 Pro Max": [
      { id: 1, src: ip16Pro, alt: "iPhone 16" },
      { id: 2, src: ip16Pro, alt: "iPhone 16 Pro" },
    ],
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:9000/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ API");
        }
        const result = await response.json();
        if (result?.data) {
          setProduct(result.data);
          setSelectedVariant(result.data.variants[0]);

          const categoryName = result.data.category?.name || "";
          const images = productImages[categoryName] || [];
          if (images.length > 0) {
            setSelectedImage(images[0].src);
          }
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi gọi API:", err);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  if (error) {
    return <div className="error">Đã xảy ra lỗi: {error}</div>;
  }

  if (!product) {
    return <p>Đang tải thông tin sản phẩm...</p>;
  }

  return (
    <div className="product-detail">
      <h1 className="product-title">{product.name}</h1>
      <div className="product-info-wrapper">
        <div className="product-image">
          <img src={selectedImage} alt="Ảnh sản phẩm lớn" />
          <div className="product-thumbnails">
            {(productImages[product.category?.name] || []).map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                onClick={() => setSelectedImage(image.src)}
                className={selectedImage === image.src ? "active" : ""}
              />
            ))}
          </div>
        </div>
        <div className="product-details">
          <p>
            <strong>Loại:</strong> {product.category?.name || "Không có"}
          </p>
          <p className="price">
            <strong>Giá bán:</strong>{" "}
            <span>
              {selectedVariant?.price.toLocaleString("vi-VN") || "Liên hệ"}đ
            </span>
          </p>
          <div className="variants">
            <p className="variant-label">Dung lượng:</p>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                className={selectedVariant?.id === variant.id ? "active" : ""}
                onClick={() => setSelectedVariant(variant)}
              >
                {variant.value}
              </button>
            ))}
          </div>
          <div className="quantity">
            <label>Số lượng:</label>
            <input type="number" min="1" defaultValue="1" />
          </div>
          <button className="add-to-cart">Thêm vào giỏ</button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);
