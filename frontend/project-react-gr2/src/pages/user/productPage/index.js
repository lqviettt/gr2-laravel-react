import { memo, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import "./style.scss";
import ProductItem from "../../../component/user/ProductItem";
import { LoadingSpinner, ErrorMessage, NoSearchResults, Button } from '../../../components';
import Pagination from "../../../components/Pagination";
import { api } from "../../../utils/apiClient";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryName, setCategoryName] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null); // Track selected iPhone series
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const fetchCategory = useCallback(async () => {
    if (categoryId) {
      try {
        const response = await api.get(`/category/${categoryId}`);
        const data = response.data;
        if (data?.data) {
          const category = data.data;
          
          if (category.parent_id) {
            try {
              const parentResponse = await api.get(`/category/${category.parent_id}`);
              const parentData = parentResponse.data;
              if (parentData?.data) {
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
        setLoading(true);
        setError(null);

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
          const categoryResponse = await api.get(`/category/${categoryIds}`);
          const categoryData = categoryResponse.data;

          if (categoryData?.data && !categoryData.data.parent_id) {
            // Nếu là category cha (không có parent_id), lấy tất cả category con
            const allCategoriesResponse = await api.get('/category');
            const allCategoriesData = allCategoriesResponse.data;

            if (allCategoriesData?.data && Array.isArray(allCategoriesData.data.data)) {
              // Lọc ra tất cả category con của category cha này
              const childCategories = allCategoriesData.data.data.filter(cat => cat.parent_id === Number.parseInt(categoryIds));
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
        const response = await api.get(apiUrl.replace(process.env.REACT_APP_API_URL, ''));
        const result = response.data;

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
        setError(error.message || "Có lỗi xảy ra khi tải sản phẩm");
        setProducts([]);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  const getSeriesButtonVariant = (seriesId) => {
    if (categoryId) return 'disabled';
    if (selectedSeries === seriesId) return 'primary';
    return 'secondary';
  };

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

        

        <h2 className="flex items-center text-sm font-medium mb-4">
          <span className="ml-2 text-xl">Xếp theo:</span>
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
                title="Không có sản phẩm"
                message="Không tìm thấy sản phẩm nào trong danh mục này."
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

export default memo(ProductsPage);
