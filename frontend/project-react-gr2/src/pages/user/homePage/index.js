import { memo, useEffect, useState } from "react";
import banner from "../../../assets/images/banner.webp";
import banner2 from "../../../assets/images/banner2.webp";
import slider1 from "../../../assets/images/slider_1.webp";
import slider2 from "../../../assets/images/slider_2.webp";
import product14 from "../../../assets/images/14promax256.webp";
import phukien from "../../../assets/images/phukien.webp";
import pindlchuan from "../../../assets/images/pineudlchuan.webp";
import pindlcao from "../../../assets/images/pineudlcao.webp";
import ip12 from "../../../assets/images/ip12.webp";
import ip12Pro from "../../../assets/images/ip12-pro.webp";
import ip13 from "../../../assets/images/ip13.webp";
import ip13Pro from "../../../assets/images/ip13-pro.webp";
import ip14 from "../../../assets/images/ip14.webp";
import ip14Pro from "../../../assets/images/ip14-pro.webp";
import ip15 from "../../../assets/images/ip15.webp";
import ip15Pro from "../../../assets/images/ip15-pro.webp";
import ip16 from "../../../assets/images/ip16.webp";
import ip16Pro from "../../../assets/images/ip16-pro.webp";
import { GrFormNextLink } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import "./style1.scss";

const HomePage = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
  const [selectedImage, setSelectedImage] = useState("");
  const productImages = {
    1: [{ id: 1, src: ip12, alt: "iPhone 12" }],
    6: [{ id: 1, src: ip12Pro, alt: "iPhone 12 Pro" }],
    11: [{ id: 1, src: ip12Pro, alt: "iPhone 12 Pro Max" }],
    2: [{ id: 1, src: ip13, alt: "iPhone 13" }],
    7: [{ id: 1, src: ip13Pro, alt: "iPhone 13 Pro" }],
    12: [{ id: 1, src: ip13Pro, alt: "iPhone 13 Pro Max" }],
    3: [{ id: 1, src: ip14, alt: "iPhone 14" }],
    8: [{ id: 1, src: ip14Pro, alt: "iPhone 14 Pro" }],
    13: [{ id: 1, src: ip14Pro, alt: "iPhone 14 Pro Max" }],
    4: [{ id: 1, src: ip15, alt: "iPhone 15" }],
    9: [{ id: 1, src: ip15Pro, alt: "iPhone 15 Pro" }],
    14: [{ id: 1, src: ip15Pro, alt: "iPhone 15 Pro Max" }],
    5: [{ id: 1, src: ip16, alt: "iPhone 16" }],
    10: [{ id: 1, src: ip16Pro, alt: "iPhone 16 Pro" }],
    15: [{ id: 1, src: ip16Pro, alt: "iPhone 16 Pro Max" }],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/product?page=1&perPage=48`
        );
        const result = await response.json();
        if (result?.data?.data) {
          setProducts(result.data.data);
          const categoryId = result.data.category_id || "";
          const images = productImages[categoryId] || [];
          if (images.length > 0) {
            setSelectedImage(images[0].src);
          }
        } else {
          console.error("Dữ liệu không hợp lệ:", result);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
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

  return (
    <content className="">
      <div className="banner">
        <img
          className="w-full h-auto shadow-lg"
          src={banner}
          alt="My React Image"
        />
      </div>
      <div className="slider flex justify-center gap-8 z-1 -top-[128px] relative">
        <div className="w-full max-w-[780px]">
          <img src={slider1} alt="Slider 1" className="rounded-lg w-full" />
        </div>
        <div className="w-full max-w-[780px]">
          <img src={slider2} alt="Slider 2" className="rounded-lg w-full" />
        </div>
      </div>
      <div className="content -top-[90px] relative">
        <div className="featured-categories">
          <h1 className="title-pageee">
            <span>DANH MỤC NỔI BẬT</span>
          </h1>
          <div className="categories-list">
            <div>
              <a
                href={`/product?search=GB&perPage=16`}
                className="category-item"
              >
                <img src={product14} alt="iPhone" className="mx-auto" />
                <span className="text-left w-4/5">iPhone</span>
              </a>
            </div>

            <div>
              <a
                href={`/product?search=cap%20sac&search=tai%20nghe&perPage=15`}
                className="category-item"
              >
                <img src={phukien} alt="Phụ kiện" className="mx-auto" />
                <span className="text-left w-4/5">Phụ kiện</span>
              </a>
            </div>
            <div>
              <a href={`/product-detail/26`} className="category-item">
                <img
                  src={pindlchuan}
                  alt="Pin EU dung lượng chuẩn"
                  className="mx-auto"
                />
                <span className="text-left w-4/5 font-semibold">
                  Pin EU DL chuẩn
                </span>
              </a>
            </div>
            <div>
              <a
                href={`/category?search=iphone&perPage=15`}
                className="category-item"
              >
                <img
                  src={pindlcao}
                  alt="Pin EU dung lượng cao"
                  className="mx-auto"
                />
                <span className="text-left w-4/5">Pin EU DL cao</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="slider flex justify-center gap-8 z-1 -top-[80px] relative">
        <div className="w-full max-w-[1600px]">
          <img src={banner2} alt="Slider 2" className="rounded-lg w-full" />
        </div>
      </div>

      <div className="content -top-[40px] relative">
        <div className="featured-categories relative">
          <h1 className="title-pageee">
            <span>iPhone</span>
          </h1>

          <div className=" flex items-center">
            {currentIndex === 0 ? null : (
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute -left-[35px] top-1/2 rounded-r-full transform -translate-y-1/2 bg-gray-200 text-white h-16 w-16 flex items-center justify-end shadow-lg z-10 hover:bg-[#007bff] group"
                style={{
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
                }}
              >
                <GrPrevious className="text-2xl mr-2 group-hover:text-white" />
              </button>
            )}
            <div className="categories-list">
              {displayedProducts.map((product) => (
                <div key={product.id}>
                  <a
                    href={`/product-detail/${product.id}`}
                    className="category-item"
                  >
                    {(productImages[product.category_id] || []).map((image) => (
                      <img
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        onClick={() => setSelectedImage(image.src)}
                        className={selectedImage === image.src ? "active" : ""}
                      />
                    ))}
                    <div className="text-left text-xl font-semibold w-4/5">
                      <p>{product.name}</p>
                      <p className="mt-5 text-red-500">
                        {formatCurrency(product.price * 1000)}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={
                currentIndex >= Math.floor(products.length / productsPerPage)
              }
              className="pl-2 absolute -right-[35px] top-1/2 transform -translate-y-1/2 bg-gray-200 h-16 w-16 flex items-center rounded-l-full overflow-hidden shadow-lg z-10 hover:bg-[#007bff] group"
              style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            >
              <GrNext className="text-2xl group-hover:text-white" />
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                (window.location.href = "/product?search=iphone&perPage=16")
              }
              className="flex items-center text-lg gap-1 p-3 text-[#007bff] border border-[#007bff] rounded-lg hover:bg-[#007bff] hover:text-blue-50 group"
            >
              Xem toàn bộ sản phẩm{" "}
              <GrFormNextLink className="text-3xl group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </content>
  );
};

export default memo(HomePage);
