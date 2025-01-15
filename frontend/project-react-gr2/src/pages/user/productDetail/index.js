import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";
import { GiCheckMark } from "react-icons/gi";
import { IoBookmarksOutline } from "react-icons/io5";
import { TiFlashOutline } from "react-icons/ti";
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
import { useCart } from "../../../component/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity <= 0) {
      setCartMessage("Số lượng phải lớn hơn 0!");
      return;
    }

    const cartItem = {
      ...product,
      selectedVariant,
      quantity,
    };
    addToCart(cartItem);
    alert("Cập nhật giỏ hàng thành công!");
  };

  const productImages = {
    "iPhone 12": [
      { id: 1, src: ip12, alt: "iPhone 12" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
    ],
    "iPhone 12 Pro": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
    ],
    "iPhone 12 Pro Max": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" },
      { id: 2, src: ip12Black, alt: "iPhone 12 Black" },
      { id: 3, src: ip12White, alt: "iPhone 12 White" },
      { id: 4, src: ip12Blue, alt: "iPhone 12 Blue" },
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
    <div className="content">
      <div className="product-detail">
        <h1 className="product-title">{product.name}</h1>
        <div className="product-info-wrapper flex justify-between">
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
              Giá bán:
              <br />
              <strong></strong>{" "}
              <span>
                {selectedVariant?.price.toLocaleString("vi-VN") || "Liên hệ"}đ
              </span>
            </p>
            <div className="variants">
              <p className="variant-label">Màu sắc:</p>
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
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />{" "}
            </div>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="status">
            <div className="">
              <div className="status_iphone mb-10">
                <h1 className="flex bg-[#007bff] p-5 text-white text-2xl font-semibold rounded-tl-[7px] rounded-tr-[7px]">
                  <IoBookmarksOutline size={30} className="mr-3" />
                  Cam kết bán hàng
                </h1>
                <div className="status_iphone_content">
                  <ul>
                    <li className="flex items-center mb-5">
                      <GiCheckMark size={20} className="mr-3" />
                      Bảo hành 12 tháng lỗi 1 đổi 1
                    </li>
                    <li className="flex items-center mb-5">
                      <GiCheckMark size={20} className="mr-3" />
                      Lên đời thu 100% giá web
                    </li>
                    <li className="flex items-center mb-5">
                      <GiCheckMark size={40} className="mr-3" />
                      Bảo hành rơi vỡ vào nước sửa chữa miễn phí không giới hạn
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark size={30} className="mr-3" />
                      Tặng kèm cáp sạc nhanh zin + Cường lực full màn
                    </li>
                  </ul>
                </div>
              </div>

              <div className="status_iphone">
                <h1 className="flex bg-[#007bff] p-5 text-white text-2xl font-semibold rounded-tl-[8px] rounded-tr-[8px]">
                  <TiFlashOutline size={30} className="mr-2" />
                  Tình trạng máy
                </h1>
                <div className="status_iphone_content">
                  <ul>
                    <li className="flex items-center mb-5">
                      <GiCheckMark size={30} className="mr-3" />
                      Máy 98% là các máy cấn móp, xước sâu nhiều
                    </li>
                    <li className="flex items-center mb-5">
                      <GiCheckMark size={30} className="mr-3" />
                      Máy 99% là các máy gần như mới, có vài vết xước nhẹ nhỏ
                    </li>
                    <li className="flex items-center">
                      <GiCheckMark size={30} className="mr-3" />
                      Máy New 100% là các máy mới chưa Active ( không box )
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetail);
