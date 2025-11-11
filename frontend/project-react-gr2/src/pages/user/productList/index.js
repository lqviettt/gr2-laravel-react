import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import "./style.scss";
import ProductItem from "../../../component/user/ProductItem";
import { LoadingSpinner, ErrorMessage, NoSearchResults, Button } from "../../../components";
import Pagination from "../../../components/Pagination";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const searchQuery = new URLSearchParams(location.search).get("search");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `${process.env.REACT_APP_API_URL}/product`;

        // Build query parameters
        const params = new URLSearchParams();
        if (categoryId) {
          params.append('category_id', categoryId);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        // Always add pagination
        params.append('perPage', '15');
        params.append('page', currentPage.toString());

        apiUrl += `?${params.toString()}`;

        console.log('Fetching products from:', apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ API");
        }
        const result = await response.json();
        console.log('API response:', result);

        // Handle different response formats
        let productsData = [];
        let totalPagesData = 1;

        if (result?.data?.data) {
          productsData = result.data.data;
          totalPagesData = result.data.last_page || result.data.totalPages || 1;
        } else if (result?.data) {
          productsData = result.data;
          totalPagesData = result.last_page || result.totalPages || 1;
        } else if (Array.isArray(result)) {
          productsData = result;
        }

        setProducts(productsData);
        setTotalPages(totalPagesData);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch products, with or without parameters
    fetchProducts();
  }, [categoryId, searchQuery, currentPage]);

  // Reset currentPage when categoryId or searchQuery changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, searchQuery]);

  // Ensure currentPage doesn't exceed totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <NoSearchResults
          title={searchQuery ? `Không tìm thấy sản phẩm nào cho "${searchQuery}"` : "Không có sản phẩm nào trong danh mục này"}
          description="Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác."
        />
      </div>
    );
  }

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleSeriesFilter = (series) => {
    if (series) {
      // Navigate to search with the series search term (without "Series")
      navigate(`/product-list?search=${encodeURIComponent(series)}`);
    } else {
      // Navigate to product-list without any filters
      navigate('/product-list');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // iPhone series data with search terms
  const iphoneSeries = [
    { id: 1, name: "iPhone 12 Series", searchTerm: "iPhone 12" },
    { id: 2, name: "iPhone 13 Series", searchTerm: "iPhone 13" },
    { id: 3, name: "iPhone 14 Series", searchTerm: "iPhone 14" },
    { id: 4, name: "iPhone 15 Series", searchTerm: "iPhone 15" },
    { id: 5, name: "iPhone 16 Series", searchTerm: "iPhone 16" },
    { id: 6, name: "iPhone 17 Series", searchTerm: "iPhone 17" },
  ];

  const getPageTitle = () => {
    if (searchQuery) {
      // Check if search query is one of the iPhone series search terms
      const isSeriesSearch = iphoneSeries.some(series => series.searchTerm === searchQuery);
      if (isSeriesSearch) {
        return "Danh mục sản phẩm";
      }
      return `Kết quả tìm kiếm cho "${searchQuery}"`;
    }

    // Category titles
    const categoryTitles = {
      1: "iPhone 12 Series",
      2: "iPhone 13 Series",
      3: "iPhone 14 Series",
      4: "iPhone 15 Series",
      5: "iPhone 16 Series",
      6: "iPhone 17 Series",
    };
    return categoryTitles[categoryId] || "Danh mục sản phẩm";
  };

  return (
    <div className="content mt-5">
      <div className="featured-categories">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center flex items-center uppercase mb-5">
          <span className="pl-2 border-l-4 border-blue-500">{getPageTitle()}</span>
        </h1>

        {/* iPhone Series Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Lọc theo Series iPhone:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleSeriesFilter(null)}
              variant={!searchQuery ? "primary" : "outline"}
              size="small"
            >
              Tất cả
            </Button>
            {iphoneSeries.map((series) => (
              <Button
                key={series.id}
                onClick={() => handleSeriesFilter(series.searchTerm)}
                variant={searchQuery === series.searchTerm ? "primary" : "outline"}
                size="small"
              >
                {series.name}
              </Button>
            ))}
          </div>
        </div>

        <h2 className="flex items-center text-sm font-medium mb-4">
          <span className="ml-2 text-xl">Sắp xếp theo giá:</span>
        </h2>
        <div className="flex gap-2 mb-10">
          <Button
            onClick={() => handleSort("asc")}
            variant="outline"
            size="small"
            leftIcon={<FaSortAmountDown />}
          >
            Giá thấp đến cao
          </Button>
          <Button
            onClick={() => handleSort("desc")}
            variant="outline"
            size="small"
            leftIcon={<FaSortAmountDown />}
          >
            Giá cao xuống thấp
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                formatCurrency={formatCurrency}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NoSearchResults
                title={searchQuery ? `Không tìm thấy sản phẩm nào cho "${searchQuery}"` : "Không có sản phẩm nào trong danh mục này"}
                description="Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác."
              />
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default memo(ProductList);
