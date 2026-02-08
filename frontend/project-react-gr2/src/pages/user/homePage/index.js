import { memo, useEffect, useState } from "react";
import product14 from "../../../assets/images/14promax256.webp";
import phukien from "../../../assets/images/phukien.webp";
import pindlchuan from "../../../assets/images/pineudlchuan.webp";
import pindlcao from "../../../assets/images/pineudlcao.webp";
import { GrFormNextLink } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import LoadingSpinner from "../../../component/user/LoadingSpinner";
import ErrorMessage from "../../../component/user/ErrorMessage";
import ProductGrid from "../../../component/user/ProductGrid";
import ProductItem from "../../../component/user/ProductItem";
import Section from "../../../component/user/Section";
import { api } from "../../../utils/apiClient";
import "./style1.scss";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [iphoneCurrentIndex, setIphoneCurrentIndex] = useState(0);
  const [accessoriesCurrentIndex, setAccessoriesCurrentIndex] = useState(0);
  const productsPerPage = 4;
  const iphoneProductsPerSlide = 1; // Dịch chuyển 1 sản phẩm mỗi lần

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleNext = () => {
    if (currentIndex < Math.floor(products.length / productsPerPage)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleIphoneNext = () => {
    const iphoneProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes("iphone") ||
        product.name.toLowerCase().includes("ip ")
    );
    if (
      iphoneCurrentIndex <
      iphoneProducts.length - sliderConfig.itemsPerView
    ) {
      setIphoneCurrentIndex(iphoneCurrentIndex + iphoneProductsPerSlide);
    }
  };

  const handleIphonePrev = () => {
    if (iphoneCurrentIndex > 0) {
      setIphoneCurrentIndex(iphoneCurrentIndex - iphoneProductsPerSlide);
    }
  };

  const handleAccessoriesNext = () => {
    if (
      accessoriesCurrentIndex <
      accessoryProducts.length - sliderConfig.itemsPerView
    ) {
      setAccessoriesCurrentIndex(accessoriesCurrentIndex + iphoneProductsPerSlide);
    }
  };

  const handleAccessoriesPrev = () => {
    if (accessoriesCurrentIndex > 0) {
      setAccessoriesCurrentIndex(accessoriesCurrentIndex - iphoneProductsPerSlide);
    }
  };

  const [products, setProducts] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch accessory products - lấy categories có parent_id=105, rồi lấy products của các categories đó
  useEffect(() => {
    const fetchAccessoryProducts = async () => {
      try {
        // Step 1: Lấy tất cả categories
        const categoriesResponse = await api.get('/category');
        if (categoriesResponse.data?.data?.data && Array.isArray(categoriesResponse.data.data.data)) {
          // Step 2: Lọc categories có parent_id = 105 (phụ kiện)
          const childCategories = categoriesResponse.data.data.data.filter(cat => cat.parent_id === 105);
          console.log('Child categories of 105:', childCategories);
          
          // Step 3: Lấy IDs của các categories đó
          const categoryIds = childCategories.map(cat => cat.id);
          
          if (categoryIds.length > 0) {
            // Step 4: Query products với các category IDs này
            const categoryQuery = categoryIds.join(',');
            const productsResponse = await api.get(`/product?category_id=${categoryQuery}&perPage=48`);
            
            if (productsResponse.data?.data?.data) {
              setAccessoryProducts(productsResponse.data.data.data);
              console.log('Accessory products fetched:', productsResponse.data.data.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching accessory products:', error);
      }
    };
    
    fetchAccessoryProducts();
  }, []);

  // Tính toán số items hiển thị và width dựa trên screen size
  const getSliderConfig = (width) => {
    if (width >= 1024) {
      // lg: 4 items
      return { itemsPerView: 4, gap: "1.5rem", totalGaps: "4.5rem" }; // 3 * 1.5rem
    } else if (width >= 768) {
      // md: 3 items
      return { itemsPerView: 3, gap: "1rem", totalGaps: "2rem" }; // 2 * 1rem
    } else {
      // mobile: 2 items
      return { itemsPerView: 2, gap: "1rem", totalGaps: "1rem" }; // 1 * 1rem
    }
  };

  const sliderConfig = getSliderConfig(windowWidth);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/product?page=1&perPage=48');

        console.log('API Response:', response); // Debug toàn bộ phản hồi từ API
        
        if (!isMounted) return;
        
        const result = response.data;
        if (result?.data?.data) {
          setProducts(result.data.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError(error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Đang tải sản phẩm..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative">
        <img
          className="w-full h-auto shadow-lg"
          src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/bannerr.png`}
          // src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/banners_1762866247_6913344726f45.webp`}
          alt="QuocViet Banner"
        />
      </div>
      
      {/* Slider Section */}
      <Section className="relative -mt-20 lg:-mt-40 z-30 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          <div className="w-full">
            <img
              src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/banners_1762866265_6913345928561.webp`}
              alt="Slider 1"
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
          <div className="w-full">
            <img
              src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/banners_1762866273_691334615ff55.webp`}
              alt="Slider 2"
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        </div>
        </div>
      </Section>

      {/* Featured Categories */}
      <Section className="relative -mt-8 lg:-mt-12 py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="flex items-start gap-4 mb-8 lg:mb-12">
          <div className="w-1 bg-blue-600 h-10"></div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            DANH MỤC NỔI BẬT
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="group">
            <a
              href={`/product?category_id=103`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img
                src={product14}
                alt="iPhone"
                className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md"
              />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">
                iPhone
              </span>
            </a>
          </div>

          <div className="group">
            <a
              href={`/product?category_id=105`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img
                src={phukien}
                alt="Phụ kiện"
                className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md"
              />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">
                Phụ kiện
              </span>
            </a>
          </div>

          <div className="group">
            <a
              href={`/product?category_id=118`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img
                src={pindlchuan}
                alt="Pin EU dung lượng chuẩn"
                className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md"
              />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">
                Pin EU DL chuẩn
              </span>
            </a>
          </div>

          <div className="group">
            <a
              href={`/product?category_id=119`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img
                src={pindlcao}
                alt="Pin EU dung lượng cao"
                className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md"
              />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">
                Pin EU DL cao
              </span>
            </a>
          </div>
        </div>
      </Section>

      {/* Second Banner */}
      <Section className="relative -mt-8 lg:-mt-12 py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-7xl mx-auto">
          <img
          src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/banners_1762866252_6913344cd5885.webp`}
            alt="Banner 2"
            className="rounded-lg w-full h-auto shadow-lg"
          />
        </div>
      </Section>

      {/* iPhone Products Section */}
      <Section className="relative -mt-8 lg:-mt-12 py-8 lg:py-12" containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4 mb-8 lg:mb-12">
          <div className="w-1 bg-blue-600 h-10"></div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            iPhone
          </h2>
        </div>
        <div className="relative overflow-hidden">
          {/* Navigation Buttons */}
          {iphoneCurrentIndex > 0 && (
            <button
              onClick={handleIphonePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200"
              style={{ marginLeft: "-20px" }} // Đẩy nửa nút ra ngoài
            >
              <GrPrevious className="text-lg lg:text-xl" />
            </button>
          )}
          {/* Products Slider Container */}
          <div className="overflow-hidden px-2 lg:px-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  iphoneCurrentIndex * (100 / sliderConfig.itemsPerView)
                }%)`,
                width: "100%",
                justifyContent: "flex-start",
                gap: sliderConfig.gap,
              }}
            >
              {products
                .filter(
                  (product) =>
                    product.name.toLowerCase().includes("iphone") ||
                    product.name.toLowerCase().includes("ip ")
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0"
                    style={{
                      width: `calc((100% - ${sliderConfig.totalGaps}) / ${sliderConfig.itemsPerView})`,
                      minWidth: `calc((100% - ${sliderConfig.totalGaps}) / ${sliderConfig.itemsPerView})`,
                    }}
                  >
                    <ProductItem
                      product={product}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                ))}
            </div>
          </div>{" "}
          <button
            onClick={handleIphoneNext}
            disabled={
              iphoneCurrentIndex >=
              products.filter(
                (product) =>
                  product.name.toLowerCase().includes("iphone") ||
                  product.name.toLowerCase().includes("ip ")
              ).length -
                sliderConfig.itemsPerView
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ marginRight: "-10px" }} // Đẩy nửa nút ra ngoài
          >
            <GrNext className="text-lg lg:text-xl" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 lg:mt-12">
          <button
            onClick={() => (window.location.href = "/product-list")}
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Xem toàn bộ sản phẩm iPhone
            <GrFormNextLink className="text-lg lg:text-xl" />
          </button>
        </div>
      </Section>

      {/* Second Banner */}
      <Section className="relative -mt-8 lg:-mt-12 py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="w-full max-w-7xl mx-auto">
          <img
          src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/banners_1767319113_69572649a095f.webp`}
            alt="Banner 2"
            className="rounded-lg w-full h-auto shadow-lg"
          />
        </div>
      </Section>

      {/* Accessories Section */}
      <Section className="relative -mt-8 lg:-mt-12 py-8 lg:py-12" containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4 mb-8 lg:mb-12">
          <div className="w-1 bg-blue-600 h-10"></div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Phụ kiện
          </h2>
        </div>
        <div className="relative overflow-hidden">
          {/* Navigation Buttons */}
          {accessoriesCurrentIndex > 0 && (
            <button
              onClick={handleAccessoriesPrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200"
              style={{ marginLeft: "-20px" }} // Đẩy nửa nút ra ngoài
            >
              <GrPrevious className="text-lg lg:text-xl" />
            </button>
          )}
          {/* Products Slider Container */}
          <div className="overflow-hidden px-2 lg:px-8">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  accessoriesCurrentIndex * (100 / sliderConfig.itemsPerView)
                }%)`,
                width: "100%",
                justifyContent: "flex-start",
                gap: sliderConfig.gap,
              }}
            >
              {accessoryProducts
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0"
                    style={{
                      width: `calc((100% - ${sliderConfig.totalGaps}) / ${sliderConfig.itemsPerView})`,
                      minWidth: `calc((100% - ${sliderConfig.totalGaps}) / ${sliderConfig.itemsPerView})`,
                    }}
                  >
                    <ProductItem
                      product={product}
                      formatCurrency={formatCurrency}
                    />
                  </div>
                ))}
            </div>
          </div>{" "}
          <button
            onClick={handleAccessoriesNext}
            disabled={
              accessoriesCurrentIndex >=
              accessoryProducts.length -
                sliderConfig.itemsPerView
            }
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ marginRight: "-10px" }} // Đẩy nửa nút ra ngoài
          >
            <GrNext className="text-lg lg:text-xl" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 lg:mt-12">
          <button
            onClick={() => (window.location.href = "/product-list")}
            className="inline-flex items-center gap-2 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base font-medium text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Xem toàn bộ sản phẩm
            <GrFormNextLink className="text-lg lg:text-xl" />
          </button>
        </div>
      </Section>
    </div>
  );
};

export default memo(HomePage);
