import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './style.scss';
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:9000/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ API");
        }
        const result = await response.json();
        if (result && result.id) {
          setProduct(result);
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
      <h2>Chi tiết sản phẩm {id} </h2>
      <div className="product-info">
        <p>
          <strong>Tên sản phẩm:</strong> {product.name}
        </p>
        <p>
          <strong>Giá:</strong> {product.price} USD
        </p>
        <p>
          <strong>Mã sản phẩm:</strong> {product.code}
        </p>
        <p>
          <strong>Số lượng:</strong> {product.quantity}
        </p>
        <p>
          <strong>Danh mục:</strong> {product.category?.name || "Không có"}
        </p>
        <p>
          <strong>Mô tả:</strong> {product.description}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {product.status === 1 ? "Còn hàng" : "Hết hàng"}
        </p>
      </div>
    </div>
  );
};

export default memo(ProductDetail);
