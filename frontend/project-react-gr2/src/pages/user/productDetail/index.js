import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.scss";
import { GiCheckMark } from "react-icons/gi";
import { IoBookmarksOutline } from "react-icons/io5";
import { TiFlashOutline } from "react-icons/ti";

import ip12 from "../../../assets/images/ip12.webp";
import ip12Black from "../../../assets/images/ip12-black.webp";
import ip12White from "../../../assets/images/ip12-white.webp";
import ip12Blue from "../../../assets/images/ip12-blue.webp";
import ip12Green from "../../../assets/images/ip12-green.webp";
import ip12Red from "../../../assets/images/ip12do.webp";
import ip12Tim from "../../../assets/images/ip12tim.webp";

import ip12Pro from "../../../assets/images/ip12-pro.webp";
import ip12prden from "../../../assets/images/ip12prden.webp";
import ip12prtrang from "../../../assets/images/ip12prtrang.webp";
import ip1vang from "../../../assets/images/ip12prvang.webp";
import ip12prxanh from "../../../assets/images/ip12prxanh.webp";

import ip13 from "../../../assets/images/ip13.webp";
import ip13do from "../../../assets/images/ip13do.webp";
import ip13den from "../../../assets/images/ip13den.webp";
import ip13hong from "../../../assets/images/ip13hong.webp";
import ip13trang from "../../../assets/images/ip13trang.webp";
import ip13xanhd from "../../../assets/images/ip13xanhd.webp";
import ip13xanhl from "../../../assets/images/ip13xanhl.webp";

import ip13Pro from "../../../assets/images/ip13-pro.webp";
import ip13Proden from "../../../assets/images/ip13prden.webp";
import ip13Provang from "../../../assets/images/ip13prvang.webp";
import ip13Protrang from "../../../assets/images/ip13prtrang.webp";
import ip13Proxanh from "../../../assets/images/ip13prxanh.webp";
import ip13Progreen from "../../../assets/images/ip13prgreen.webp";

import ip14 from "../../../assets/images/ip14.webp";
import ip14den from "../../../assets/images/ip14den.webp";
import ip14trang from "../../../assets/images/ip14trang.webp";
import ip14do from "../../../assets/images/ip14do.webp";
import ip14xanhd from "../../../assets/images/ip14xanhd.webp";
import ip14tim from "../../../assets/images/ip14tim.webp";
import ip14vang from "../../../assets/images/ip14vang.webp";

import ip14Pro from "../../../assets/images/ip14-pro.webp";
import ip14Proden from "../../../assets/images/ip14prden.webp";
import ip14Protrang from "../../../assets/images/ip14prtrang.webp";
import ip14Provang from "../../../assets/images/ip14prvang.webp";
import ip14Protim from "../../../assets/images/ip14prtim.webp";

import ip15 from "../../../assets/images/ip15.webp";
import ip15den from "../../../assets/images/ip15den.webp";
import ip15hong from "../../../assets/images/ip15hong.webp";
import ip15vang from "../../../assets/images/ip15vang.webp";
import ip15xanhd from "../../../assets/images/ip15xanhd.webp";
import ip15xanhl from "../../../assets/images/ip15xanhl.webp";

import ip15Pro from "../../../assets/images/ip15-pro.webp";
import ip15prttd from "../../../assets/images/ip15prttd.webp";
import ip15prttt from "../../../assets/images/ip15prttt.webp";
import ip15prtttn from "../../../assets/images/ip15prtttn.webp";
import ip15prttx from "../../../assets/images/ip15prttx.webp";

import ip16 from "../../../assets/images/ip16.webp";
import ip16den from "../../../assets/images/ip16den.webp";
import ip16trang from "../../../assets/images/ip16trang.webp";
import ip16hong from "../../../assets/images/ip16hong.webp";
import ip16xanh from "../../../assets/images/ip16xanh.webp";
import ip16luuly from "../../../assets/images/ip16luuly.webp";

import ip16Pro from "../../../assets/images/ip16-pro.webp";
import ip16prttd from "../../../assets/images/ip16prttd.webp";
import ip16prttt from "../../../assets/images/ip16prttt.webp";
import ip16prtttn from "../../../assets/images/ip16prtttn.webp";
import ip16prttsm from "../../../assets/images/ip16prttsm.webp";

import { useCart } from "../../../component/CartContext";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productByCategory, setProductByCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleClick = (productId) => {
    setSelectedProductId(productId);
    navigate(`/product-detail/${productId}`);
  };

  const handleAddToCart = () => {
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
      { id: 2, src: ip12Black, alt: "Đen" },
      { id: 3, src: ip12White, alt: "Trắng" },
      { id: 4, src: ip12Red, alt: "Đỏ" },
      { id: 5, src: ip12Tim, alt: "Tím" },
      { id: 6, src: ip12Blue, alt: "Xanh Dương" },
      { id: 7, src: ip12Green, alt: "Xanh Lá" },
    ],
    "iPhone 12 Pro": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro" },
      { id: 2, src: ip12prden, alt: "Đen" },
      { id: 3, src: ip12prtrang, alt: "Trắng" },
      { id: 4, src: ip1vang, alt: "Vàng" },
      { id: 5, src: ip12prxanh, alt: "Xanh" },
    ],
    "iPhone 12 Pro Max": [
      { id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" },
      { id: 2, src: ip12prden, alt: "Đen" },
      { id: 3, src: ip12prtrang, alt: "Trắng" },
      { id: 4, src: ip1vang, alt: "Vàng" },
      { id: 5, src: ip12prxanh, alt: "Xanh" },
    ],
    "iPhone 13": [
      { id: 1, src: ip13, alt: "iPhone 13" },
      { id: 2, src: ip13do, alt: "Đỏ" },
      { id: 3, src: ip13den, alt: "Đen" },
      { id: 4, src: ip13hong, alt: "Hồng" },
      { id: 5, src: ip13trang, alt: "Trắng" },
      { id: 6, src: ip13xanhd, alt: "Xanh Dương" },
      { id: 7, src: ip13xanhl, alt: "Xanh Lá" },
    ],
    "iPhone 13 Pro": [
      { id: 1, src: ip13Pro, alt: "iPhone 13 Pro" },
      { id: 2, src: ip13Proden, alt: "Đen" },
      { id: 3, src: ip13Protrang, alt: "Trắng" },
      { id: 4, src: ip13Provang, alt: "Vàng" },
      { id: 5, src: ip13Progreen, alt: "Xanh Green" },
      { id: 6, src: ip13Proxanh, alt: "Xanh" },
    ],
    "iPhone 13 Pro Max": [
      { id: 1, src: ip13Pro, alt: "iPhone 13 Pro Max" },
      { id: 2, src: ip13Proden, alt: "Đen" },
      { id: 3, src: ip13Protrang, alt: "Trắng" },
      { id: 4, src: ip13Provang, alt: "Vàng" },
      { id: 5, src: ip13Progreen, alt: "Xanh Green" },
      { id: 6, src: ip13Proxanh, alt: "Xanh" },
    ],
    "iPhone 14": [
      { id: 1, src: ip14, alt: "iPhone 14" },
      { id: 2, src: ip14den, alt: "Đen" },
      { id: 3, src: ip14trang, alt: "Trắng" },
      { id: 4, src: ip14do, alt: "Đỏ" },
      { id: 5, src: ip14xanhd, alt: "Xanh Dương" },
      { id: 6, src: ip14tim, alt: "Tím" },
      { id: 7, src: ip14vang, alt: "Vàng" },
    ],
    "iPhone 14 Pro": [
      { id: 1, src: ip14Pro, alt: "iPhone 14 Pro" },
      { id: 2, src: ip14Proden, alt: "Đen" },
      { id: 3, src: ip14Protrang, alt: "Trắng" },
      { id: 4, src: ip14Provang, alt: "Vàng" },
      { id: 5, src: ip14Protim, alt: "Tím" },
    ],
    "iPhone 14 Pro Max": [
      { id: 1, src: ip14Pro, alt: "iPhone 14 Pro Max" },
      { id: 2, src: ip14Proden, alt: "Đen" },
      { id: 3, src: ip14Protrang, alt: "Trắng" },
      { id: 4, src: ip14Provang, alt: "Vàng" },
      { id: 5, src: ip14Protim, alt: "Tím" },
    ],
    "iPhone 15": [
      { id: 1, src: ip15, alt: "iPhone 15" },
      { id: 2, src: ip15den, alt: "Đen" },
      { id: 3, src: ip15hong, alt: "Hồng" },
      { id: 4, src: ip15vang, alt: "Vàng" },
      { id: 5, src: ip15xanhd, alt: "Xanh Dương" },
      { id: 6, src: ip15xanhl, alt: "Xanh Lá" },
    ],
    "iPhone 15 Pro": [
      { id: 1, src: ip15Pro, alt: "iPhone 15 Pro" },
      { id: 2, src: ip15prttd, alt: "Titan Đen" },
      { id: 3, src: ip15prttt, alt: "Titan Trắng" },
      { id: 4, src: ip15prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip15prttx, alt: "Titan Xanh" },
    ],
    "iPhone 15 Pro Max": [
      { id: 1, src: ip15Pro, alt: "iPhone 15 Pro Max" },
      { id: 2, src: ip15prttd, alt: "Titan Đen" },
      { id: 3, src: ip15prttt, alt: "Titan Trắng" },
      { id: 4, src: ip15prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip15prttx, alt: "Titan Xanh" },
    ],
    "iPhone 16": [
      { id: 1, src: ip16, alt: "iPhone 16" },
      { id: 2, src: ip16den, alt: "Đen" },
      { id: 3, src: ip16trang, alt: "Trắng" },
      { id: 4, src: ip16hong, alt: "Hồng" },
      { id: 5, src: ip16xanh, alt: "Xanh Mòng Két" },
      { id: 6, src: ip16luuly, alt: "Xanh Lưu Ly" },
    ],
    "iPhone 16 Pro": [
      { id: 1, src: ip16Pro, alt: "iPhone 16 Pro" },
      { id: 2, src: ip16prttd, alt: "Titan Đen" },
      { id: 3, src: ip16prttt, alt: "Titan Trắng" },
      { id: 4, src: ip16prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip16prttsm, alt: "Titan Sa Mạc" },
    ],
    "iPhone 16 Pro Max": [
      { id: 1, src: ip16Pro, alt: "iPhone 16 Pro Max" },
      { id: 2, src: ip16prttd, alt: "Titan Đen" },
      { id: 3, src: ip16prttt, alt: "Titan Trắng" },
      { id: 4, src: ip16prtttn, alt: "Titan Tự Nhiên" },
      { id: 5, src: ip16prttsm, alt: "Titan Sa Mạc" },
    ],
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/product/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ API");
        }
        const result = await response.json();
        if (result?.data) {
          setProduct(result.data);
          setSelectedVariant(result.data.variants[0]);
          setCategoryId(result.data.category_id);
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

  useEffect(() => {
    const fetchProductByCategory = async () => {
      if (!categoryId) return;
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/product?category_id=${categoryId}`
        );
        const result = await response.json();
        setProductByCategory(result.data.data);
        console.log("product", result.data.data);
        // console.log(result.data.data);
      } catch (error) {
        console.error(
          "Error fetching product by category:",
          error.response?.data || error.message
        );
      }
    };

    fetchProductByCategory();
  }, [categoryId]);

  if (error) {
    return <div className="error">Đã xảy ra lỗi: {error}</div>;
  }

  if (!product) {
    return <p>Đang tải thông tin sản phẩm...</p>;
  }

  return (
    <div className="content-wrapper">
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
            <div className="text-2xl font-semibold mb-6">
              Loại:{" "}
              <span className="text-blue-400">
                {product.category?.name || "Không có"}
              </span>
            </div>
            <p className="price text-xl font-semibold">
              Giá bán:
              <br />
              <span>
                {selectedVariant?.price.toLocaleString("vi-VN") || "Liên hệ"}
                .000đ
              </span>
            </p>

            {Array.isArray(productByCategory) &&
            productByCategory.length > 0 ? (
              <div className="">
                {productByCategory.map((product) => {
                  const storage = product.name.split(" ").pop();
                  const isSelected = product.id === selectedProductId;

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleClick(product.id)}
                      className={`px-6 mr-4 mt-3 py-2 rounded-md border ${
                        isSelected ? "border-[#007bff]" : ""
                      }`}
                    >
                      <h3>{storage}</h3>
                      <p className="price text-m font-semibold text-red-600">
                        {product.price * 1000
                          ? (product.price * 1000).toLocaleString("vi-VN")
                          : "Liên hệ"}
                        đ
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p>Không có sản phẩm cùng loại.</p>
            )}

            <div className="variants mb-5">
              <p className="variant-label text-xl font-semibold">Màu sắc:</p>
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={
                    selectedVariant?.id === variant.id
                      ? "active"
                      : "" + "border"
                  }
                  onClick={() => {
                    setSelectedVariant(variant);
                    {
                      productImages[product.category.name]?.forEach((image) => {
                        if (image.alt.includes(variant.value)) {
                          setSelectedImage(image.src);
                        }
                      });
                    }
                  }}
                >
                  {variant.value}
                </button>
              ))}
            </div>

            <div className="text-xl font-semibold">Số lượng:</div>
            <div className="rounded-md border border-[#007bff] flex gap-2 items-center bg-white p-1 w-max">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="border bg-[#007bff] hover:bg-red-700 text-white rounded-md p-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  viewBox="0 0 121.805 121.804"
                >
                  <path d="M7.308 68.211h107.188a7.309 7.309 0 0 0 7.309-7.31 7.308 7.308 0 0 0-7.309-7.309H7.308a7.31 7.31 0 0 0 0 14.619z" />
                </svg>
              </button>

              <span className="text-gray-800 text-lg font-semibold px-2">
                {quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="border bg-[#007bff] hover:bg-red-700 text-white rounded-md p-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 509.892c-19.058 0-34.5-15.442-34.5-34.5V36.608c0-19.058 15.442-34.5 34.5-34.5s34.5 15.442 34.5 34.5v438.784c0 19.058-15.442 34.5-34.5 34.5z" />
                  <path d="M475.392 290.5H36.608c-19.058 0-34.5-15.442-34.5-34.5s15.442-34.5 34.5-34.5h438.784c19.058 0 34.5 15.442 34.5 34.5s-15.442 34.5-34.5 34.5z" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-semibold mt-6">
              Tình trạng: <span className="text-blue-400">Máy LikeNew 99%</span>
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
