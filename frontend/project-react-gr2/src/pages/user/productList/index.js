import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import LoadingSpinner from "../../../component/user/LoadingSpinner";
import ErrorMessage from "../../../component/user/ErrorMessage";
import ProductGrid from "../../../component/user/ProductGrid";
import Section from "../../../component/user/Section";
import { formatCurrency } from "../../../utils/common";
import "./style.scss";

const ProductList = () => {
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/product?category_id=${categoryId}`
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
    return <LoadingSpinner message="Đang tải danh sách sản phẩm..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium">Không có sản phẩm nào trong danh mục này.</h3>
        </div>
      </div>
    );
  }

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  const getCategoryTitle = () => {
    // You can expand this with more category mappings
    const categoryTitles = {
      1: "iPhone 12 Series",
      2: "iPhone 13 Series",
      3: "iPhone 14 Series",
      4: "iPhone 15 Series",
      5: "iPhone 16 Series",
    };
    return categoryTitles[categoryId] || "Danh mục sản phẩm";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            {getCategoryTitle()}
          </h1>

          {/* Sort Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm lg:text-base font-medium text-gray-700">
              <FaSortAmountDown />
              <span>Xếp theo:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSort("asc")}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-md transition-colors ${
                  sortOrder === "asc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Giá thấp đến cao
              </button>
              <button
                onClick={() => handleSort("desc")}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base rounded-md transition-colors ${
                  sortOrder === "desc"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Giá cao xuống thấp
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={sortedProducts}
          columns={{ default: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
          className="gap-4 lg:gap-6"
        />

        {/* Results Count */}
        <div className="text-center mt-8 text-sm lg:text-base text-gray-600">
          Hiển thị {sortedProducts.length} sản phẩm
        </div>
      </Section>
    </div>
  );
};

export default memo(ProductList);
