import { memo, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import "./style.scss";
import ProductItem from "../../../component/user/ProductItem";
import Pagination from "../../../components/Pagination";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryName, setCategoryName] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null); // Track selected iPhone series
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const fetchCategory = useCallback(async () => {
    if (categoryId) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/category/${categoryId}`);
        const data = await response.json();
        if (data && data.data) {
          const category = data.data;
          
          if (category.parent_id) {
            try {
              const parentResponse = await fetch(`${process.env.REACT_APP_API_URL}/category/${category.parent_id}`);
              const parentData = await parentResponse.json();
              if (parentData && parentData.data) {
                setCategoryName(parentData.data.name);
              } else {
                setCategoryName(category.name);
              }
            } catch (parentError) {
              console.error("Error fetching parent category:", parentError);
              setCategoryName(category.name);
            }
          } else {
            setCategoryName(category.name);
          }
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      try {
        let apiUrl = `${process.env.REACT_APP_API_URL}/product?perPage=15&page=${page}`;

        // Build category filter
        let categoryIds = null;

        // Priority: URL categoryId > selectedSeries
        if (categoryId) {
          // If we have a categoryId from URL, use it (ignore series filter)
          categoryIds = categoryId;
        } else if (selectedSeries) {
          // If no URL categoryId but series is selected, use series
          if (selectedSeries === 'all') {
            // Show all products (no category filter)
            categoryIds = null;
          } else {
            // Filter by selected series
            categoryIds = selectedSeries;
          }
        }

        // If we have category filter, get category details
        if (categoryIds && categoryIds !== 'all') {
          const categoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/category/${categoryIds}`);
          const categoryData = await categoryResponse.json();

          if (categoryData && categoryData.data && !categoryData.data.parent_id) {
            // Nếu là category cha (không có parent_id), lấy tất cả category con
            const allCategoriesResponse = await fetch(`${process.env.REACT_APP_API_URL}/category`);
            const allCategoriesData = await allCategoriesResponse.json();

            if (allCategoriesData && allCategoriesData.data && Array.isArray(allCategoriesData.data.data)) {
              // Lọc ra tất cả category con của category cha này
              const childCategories = allCategoriesData.data.data.filter(cat => cat.parent_id === parseInt(categoryIds));
              categoryIds = childCategories.map(cat => cat.id);

              console.log('Child categories found:', childCategories);
              console.log('Category IDs to fetch products:', categoryIds);
            }
          }

          // Tạo query string cho multiple category_ids
          const categoryQuery = Array.isArray(categoryIds)
            ? `category_id=${categoryIds.join(',')}`
            : `category_id=${categoryIds}`;

          apiUrl = `${process.env.REACT_APP_API_URL}/product?${categoryQuery}&perPage=15&page=${page}`;
        }

        console.log('Fetching products from:', apiUrl);
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
          setTotalPages(result.data.last_page || result.data.totalPages || 1);
          console.log('Total products found:', result.data.data.length);
        } else {
          console.log("No products found.");
          setProducts([]);
          setTotalPages(1);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };

    // Fetch products khi component mount hoặc filters thay đổi
    if (categoryId) {
      fetchCategory();
    } else {
      setCategoryName(''); // Reset category name khi không có categoryId
    }
    fetchProducts(currentPage);
  }, [categoryId, currentPage, selectedSeries, fetchCategory]);

  // Reset currentPage when selectedSeries changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeries]);

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleSeriesFilter = (seriesId) => {
    setSelectedSeries(seriesId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // iPhone series data
  const iphoneSeries = [
    { id: 1, name: "iPhone 12 Series" },
    { id: 2, name: "iPhone 13 Series" },
    { id: 3, name: "iPhone 14 Series" },
    { id: 4, name: "iPhone 15 Series" },
    { id: 5, name: "iPhone 16 Series" },
    { id: 6, name: "iPhone 17 Series" },
  ];

  return (
    <div className="content mt-5">
      <div className="featured-categories">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center flex items-center uppercase mb-5">
          <span className="pl-2 border-l-4 border-blue-500">
            {categoryName ||
             (selectedSeries ? iphoneSeries.find(s => s.id === selectedSeries)?.name : null) ||
             'Sản phẩm'}
          </span>
        </h1>

        {/* iPhone Series Filter - luôn hiển thị */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            Lọc theo Series iPhone:
            {categoryId && <span className="text-sm text-gray-500 ml-2">(Không khả dụng khi đang lọc theo danh mục)</span>}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSeriesFilter(null)}
              disabled={!!categoryId}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                categoryId
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : selectedSeries === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            >
              Tất cả
            </button>
            {iphoneSeries.map((series) => (
              <button
                key={series.id}
                onClick={() => handleSeriesFilter(series.id)}
                disabled={!!categoryId}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  categoryId
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedSeries === series.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {series.name}
              </button>
            ))}
          </div>
        </div>

        <h2 className="flex items-center text-sm font-medium mb-4">
          <span className="ml-2 text-xl">Xếp theo:</span>
        </h2>
        <div className="flex gap-2 mb-10">
          <button onClick={() => handleSort("asc")} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition">
            <FaSortAmountDown />
            <span>Giá thấp đến cao</span>
          </button>
          <button onClick={() => handleSort("desc")} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-blue-600 hover:text-white transition">
            <FaSortAmountDown />
            <span>Giá cao xuống thấp</span>
          </button>
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
            <p>Không có danh mục nào.</p>
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

export default memo(ProductsPage);
