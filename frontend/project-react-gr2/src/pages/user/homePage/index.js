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
import Section from "../../../component/user/Section";
import "./style1.scss";

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 4;

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/product?page=1&perPage=48`
        );
        const result = await response.json();
        if (result?.data?.data) {
          setProducts(result.data.data);
        } else {
          throw new Error("Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );

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
            <img src={slider1} alt="Slider 1" className="rounded-lg w-full h-auto shadow-lg" />
          </div>
          <div className="w-full">
            <img src={slider2} alt="Slider 2" className="rounded-lg w-full h-auto shadow-lg" />
          </div>
        </div>
      </Section>

      {/* Featured Categories */}
      <Section
        title="DANH MỤC NỔI BẬT"
        className="relative -mt-8 lg:-mt-12"
        titleClassName="text-xl sm:text-2xl lg:text-3xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="group">
            <a
              href={`/product?search=GB&perPage=16`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img src={product14} alt="iPhone" className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md" />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">iPhone</span>
            </a>
          </div>

          <div className="group">
            <a
              href={`/product?search=cap%20sac&search=tai%20nghe&perPage=15`}
              className="category-item block transition-transform duration-200 hover:scale-105"
            >
              <img src={phukien} alt="Phụ kiện" className="mx-auto w-full h-auto rounded-lg shadow-sm group-hover:shadow-md" />
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">Phụ kiện</span>
            </a>
          </div>

          <div className="group">
            <a href={`/product-detail/26`} className="category-item block transition-transform duration-200 hover:scale-105">
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
              <span className="text-center block mt-3 text-sm sm:text-base font-medium text-gray-800 group-hover:text-blue-600">Pin EU DL cao</span>
            </a>
          </div>
        </div>
      </Section>

      {/* Second Banner */}
      <Section className="relative -mt-8 lg:-mt-12">
        <div className="w-full max-w-6xl mx-auto">
          <img src={banner2} alt="Banner 2" className="rounded-lg w-full h-auto shadow-lg" />
        </div>
      </Section>

      {/* iPhone Products Section */}
      <Section
        title="iPhone"
        className="relative -mt-8 lg:-mt-12"
        titleClassName="text-xl sm:text-2xl lg:text-3xl"
      >
        <div className="relative">
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute -left-4 lg:-left-12 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200"
            >
              <GrPrevious className="text-lg lg:text-xl" />
            </button>
          )}

          {/* Products Grid */}
          <div className="px-12 lg:px-16">
            <ProductGrid
              products={displayedProducts}
              columns={{ default: 2, sm: 2, md: 3, lg: 4 }}
              className="gap-4 lg:gap-6"
            />
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= Math.floor(products.length / productsPerPage)}
            className="absolute -right-4 lg:-right-12 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 text-blue-600 rounded-full h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GrNext className="text-lg lg:text-xl" />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 lg:mt-12">
          <button
            onClick={() =>
              (window.location.href = "/product?search=iphone&perPage=16")
            }
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
