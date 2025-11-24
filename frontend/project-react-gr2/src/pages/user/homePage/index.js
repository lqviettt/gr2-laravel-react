import { memo, useEffect, useState } from "react";
import banner from "../../../assets/images/banner.webp";
import banner2 from "../../../assets/images/banner2.webp";
import slider1 from "../../../assets/images/slider_1.webp";
import slider2 from "../../../assets/images/slider_2.webp";
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          src={banner}
          alt="QuocViet Banner"
        />
      </div>

      {/* Slider Section */}
      <Section className="relative -mt-16 lg:-mt-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          <div className="w-full">
            <img
              src={slider1}
              alt="Slider 1"
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
          <div className="w-full">
            <img
              src={slider2}
              alt="Slider 2"
              className="rounded-lg w-full h-auto shadow-lg"
            />
          </div>
        </div>
      </Section>

      {/* Featured Categories */}
      <Section className="relative -mt-8 lg:-mt-12">
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
              href={`/product?search=cap%20sac&search=tai%20nghe&perPage=15`}
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
              href={`/product-detail/26`}
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
              href={`/category?search=iphone&perPage=15`}
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
      <Section className="relative -mt-8 lg:-mt-12">
        <div className="w-full max-w-6xl mx-auto">
          <img
            src={banner2}
            alt="Banner 2"
            className="rounded-lg w-full h-auto shadow-lg"
          />
        </div>
      </Section>

      {/* iPhone Products Section */}
      <Section className="relative -mt-8 lg:-mt-12">
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
          <div className="overflow-hidden px-12 lg:px-16">
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
            style={{ marginRight: "-20px" }} // Đẩy nửa nút ra ngoài
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
    </div>
  );
};

export default memo(HomePage);
