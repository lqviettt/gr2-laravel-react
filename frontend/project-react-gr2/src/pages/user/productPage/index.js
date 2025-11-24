import { memo, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FaSortAmountDown } from "react-icons/fa";
import "./style.scss";
import ProductItem from "../../../component/user/ProductItem";
import { useBreadcrumb } from "../../../component/BreadcrumbContext";
import { LoadingSpinner, ErrorMessage, NoSearchResults, Button } from '../../../components';
import Pagination from "../../../components/Pagination";
import { api } from "../../../utils/apiClient";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const { setBreadcrumbTrail } = useBreadcrumb();
  const categoryId = new URLSearchParams(location.search).get("category_id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categoryName, setCategoryName] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null); // Track selected iPhone series
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState(null); // Store current category info
  const [childCategories, setChildCategories] = useState([]); // Store child categories for filter
  const [selectedChildCategory, setSelectedChildCategory] = useState(null); // Track selected child category

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
          setCategoryData(category);
          
          // Fetch child categories if this is a parent category (but NOT for Điện thoại which is 103)
          const catIdNum = Number.parseInt(categoryId);
          if (!category.parent_id && catIdNum !== 103) {
            try {
              const allCategoriesResponse = await api.get('/category');
              const allCategoriesData = allCategoriesResponse.data;
              if (allCategoriesData?.data && Array.isArray(allCategoriesData.data.data)) {
                const children = allCategoriesData.data.data.filter(cat => cat.parent_id === catIdNum);
                setChildCategories(children);
              }
            } catch (childErr) {
              setChildCategories([]);
            }
          } else {
            setChildCategories([]);
          }
          
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
              setCategoryName(category.name);
            }
          } else {
            setCategoryName(category.name);
          }
        }
      } catch (error) {
      }
    }
  }, [categoryId]);

  // Fetch category hierarchy for breadcrumb
  useEffect(() => {
    const fetchCategoryHierarchy = async () => {
      if (categoryId) {
        let trail = [];
        let currentCatId = categoryId;
        let depth = 0;
        
        while (currentCatId && depth < 10) {
          try {
            const response = await api.get(`/category/${currentCatId}`);
            const category = response.data?.data;
            if (!category) break;
            
            let path = `/product?category_id=${category.id}`;
            trail.unshift({ name: category.name, path, clickable: true });
            currentCatId = category.parent_id;
            depth++;
          } catch (err) {
            break;
          }
        }
        
        if (trail.length > 0) {
          setBreadcrumbTrail(trail);
        }
      }
    };

    fetchCategoryHierarchy();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        let apiUrl = `${process.env.REACT_APP_API_URL}/product?perPage=15&page=${page}`;

        // Priority: selectedSeries > selectedChildCategory > categoryId
        if (selectedSeries) {
          // Series filter (for Điện thoại category)
          apiUrl = `${process.env.REACT_APP_API_URL}/product?search=${encodeURIComponent(selectedSeries)}&perPage=15&page=${page}`;
        } else if (selectedChildCategory) {
          // Child category filter (for parent categories like Phụ kiện)
          apiUrl = `${process.env.REACT_APP_API_URL}/product?category_id=${selectedChildCategory}&perPage=15&page=${page}`;
        } else if (categoryId) {
          // Main category filter
          let categoryIds = categoryId;

          const categoryResponse = await api.get(`/category/${categoryIds}`);
          const categoryData = categoryResponse.data;

          if (categoryData?.data && !categoryData.data.parent_id) {
            // If it's a parent category, get all child categories
            const allCategoriesResponse = await api.get('/category');
            const allCategoriesData = allCategoriesResponse.data;

            if (allCategoriesData?.data && Array.isArray(allCategoriesData.data.data)) {
              const childCategories = allCategoriesData.data.data.filter(cat => cat.parent_id === Number.parseInt(categoryIds));
              categoryIds = childCategories.map(cat => cat.id);
            }
          }

          const categoryQuery = Array.isArray(categoryIds)
            ? `category_id=${categoryIds.join(',')}`
            : `category_id=${categoryIds}`;

          apiUrl = `${process.env.REACT_APP_API_URL}/product?${categoryQuery}&perPage=15&page=${page}`;
        }

        const response = await api.get(apiUrl.replace(process.env.REACT_APP_API_URL, ''));
        const result = response.data;

        if (result && Array.isArray(result.data.data)) {
          setProducts(result.data.data);
          setTotalPages(result.data.last_page || result.data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }

      } catch (error) {
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
  }, [categoryId, currentPage, selectedSeries, selectedChildCategory, fetchCategory]);

  // Reset currentPage when selectedSeries changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeries]);

  // Reset selectedSeries when categoryId changes
  useEffect(() => {
    setSelectedSeries(null);
    setSelectedChildCategory(null);
  }, [categoryId]);

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleSeriesFilter = (seriesSearchTerm) => {
    setSelectedSeries(seriesSearchTerm);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleChildCategoryFilter = (childCategoryId) => {
    setSelectedChildCategory(childCategoryId);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // iPhone series data
  const iphoneSeries = [
    { id: 1, name: "iPhone 12 Series", searchTerm: "iPhone 12" },
    { id: 2, name: "iPhone 13 Series", searchTerm: "iPhone 13" },
    { id: 3, name: "iPhone 14 Series", searchTerm: "iPhone 14" },
    { id: 4, name: "iPhone 15 Series", searchTerm: "iPhone 15" },
    { id: 5, name: "iPhone 16 Series", searchTerm: "iPhone 16" },
    { id: 6, name: "iPhone 17 Series", searchTerm: "iPhone 17" },
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
             (selectedSeries ? `${selectedSeries} Series` : null) ||
             'Sản phẩm'}
          </span>
        </h1>

        {/* Filter Section - iPhone Series or Child Categories */}
        {Number.parseInt(categoryId) === 103 ? (
          // Show iPhone Series filter for Điện thoại category
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleSeriesFilter(null)}
                variant={!selectedSeries ? "primary" : "outline"}
                size="small"
              >
                Tất cả
              </Button>
              {iphoneSeries.map((series) => (
                <Button
                  key={series.id}
                  onClick={() => handleSeriesFilter(series.searchTerm)}
                  variant={selectedSeries === series.searchTerm ? "primary" : "outline"}
                  size="small"
                >
                  {series.name}
                </Button>
              ))}
            </div>
          </div>
        ) : childCategories.length > 0 ? (
          // Show child categories filter only if they exist
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleChildCategoryFilter(null)}
                variant={!selectedChildCategory ? "primary" : "outline"}
                size="small"
              >
                Tất cả
              </Button>
              {childCategories.map((child) => (
                <Button
                  key={child.id}
                  onClick={() => handleChildCategoryFilter(child.id)}
                  variant={selectedChildCategory === child.id ? "primary" : "outline"}
                  size="small"
                >
                  {child.name}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

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
