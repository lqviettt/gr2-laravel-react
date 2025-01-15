import { memo, useState } from "react";
import "./style_h.scss";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { PiHandbagFill } from "react-icons/pi";
import { SiGooglemaps } from "react-icons/si";
import { IoLogIn } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router";
import { useCart } from "../../../../component/CartContext";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { cartItems } = useCart(); // Lấy giỏ hàng từ context

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleMouseEnter = (menuKey) => {
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleLinkClick = () => {
    setActiveMenu(null);
  };

  const [showCart, setShowCart] = useState(false);

  const handleToggleCart = (event) => {
    event.preventDefault();
    setShowCart(!showCart);
  };

  const menus = [
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Điện thoại",
      path: "",
      child: [
        {
          name: "iPhone 16 Series",
          child: [
            { name: "iPhone 16 Pro Max", path: "/product-list?category_id=15" },
            { name: "iPhone 16 Pro", path: "/product-list?category_id=10" },
            { name: "iPhone 16", path: "/product-list?category_id=5" },
          ],
        },
        {
          name: "iPhone 15 Series",
          child: [
            { name: "iPhone 15 Pro Max", path: "/product-list?category_id=14" },
            { name: "iPhone 15 Pro", path: "/product-list?category_id=9" },
            { name: "iPhone 15", path: "/product-list?category_id=4" },
          ],
        },
        {
          name: "iPhone 14 Series",
          child: [
            { name: "iPhone 14 Pro Max", path: "/product-list?category_id=13" },
            { name: "iPhone 14 Pro", path: "/product-list?category_id=8" },
            { name: "iPhone 14", path: "/product-list?category_id=3" },
          ],
        },
        {
          name: "iPhone 13 Series",
          child: [
            { name: "iPhone 13 Pro Max", path: "/product-list?category_id=12" },
            { name: "iPhone 13 Pro", path: "/product-list?category_id=7" },
            { name: "iPhone 13", path: "/product-list?category_id=2" },
          ],
        },
        {
          name: "iPhone 12 Series",
          child: [
            { name: "iPhone 12 Pro Max", path: "/product-list?category_id=11" },
            { name: "iPhone 12 Pro", path: "/product-list?category_id=6" },
            { name: "iPhone 12", path: "/product-list?category_id=1" },
          ],
        },
      ],
    },
    {
      name: "Phụ kiện",
      path: "",
      child: [
        {
          name: "Củ sạc iPhone, iPad",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
        {
          name: "Cáp sạc iPhone, iPad",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
        {
          name: "Tai nghe iPhone",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
      ],
    },
    {
      name: "Linh kiện",
      path: "",
      child: [
        {
          name: "Pin EU",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
        {
          name: "Pin Pisen",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
        {
          name: "Màn hình",
          child: [
            { name: "Củ sạc 20W A", path: "/charger-a" },
            { name: "Củ sạc 20W B", path: "/charger-b" },
          ],
        },
      ],
    },
    {
      name: "Chính sách bảo hành",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Chính sách đổi trả, lên đời",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Liên hệ",
      path: ROUTERS.USER.HOME,
    },
  ];

  return (
    <header className="font-[sans-serif] min-h-[65px] tracking-wide relative z-50">
      <div className="flex justify-between items-center w-full bg-[#afafaf]">
        <div className="ml-32 h_top">
          <Link to="">
            <h1 className="text-2xl font-bold">QuocViet</h1>
          </Link>
        </div>

        <div className="h_items items-center space-x-11">
          <div className="menu_search mr-4">
            <form action="" method="GET">
              <input
                type="text"
                name="search"
                placeholder="Tìm kiếm sản phẩm..."
                required
                className="p-4 rounded border border-gray-300"
              />
              <button type="submit" className="p-4 bg-blue-500 rounded">
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="menu_hotline flex items-center space-x-2">
            <div className="icon">
              <FaPhoneAlt />
            </div>
            <div className="content">
              <a title="0981218999" href="tel:0981218907">
                Hotline <br />
                <span>0981218999</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center space-x-2">
            <div className="icon">
              <SiGooglemaps />
            </div>
            <div className="content">
              <a title="Hệ thống cửa hàng" href="#">
                Hệ thống <br />
                <span>cửa hàng</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center space-x-2">
            <div className="icon">
              <BsClipboard2CheckFill />
            </div>
            <div className="content">
              <a href="#">
                Tra cứu <br />
                <span>đơn hàng</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center">
            <div className="icon">
              <PiHandbagFill />
            </div>
            <div className="content">
              <a href="/cart">
                Giỏ hàng <br />
                <span>Sản phẩm</span>{" "}
                <span className="spanChild">{totalQuantity}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="h_account mr-64">
          <ul className="flex items-center space-x-6">
            <li className="menu_items">
              <div className="menu_info flex items-center space-x-2">
                <FaUser />
                <span>Thông tin</span>
              </div>
              <ul className="submenu">
                <li>
                  <Link to="#">
                    <IoLogIn />
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link to="">
                    <FaUserPlus />
                    Đăng ký
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <nav className="h_menu">
        <ul>
          {menus.map((menu, menuKey) => (
            <li
              key={menuKey}
              className={`menu_itemss ${menu.child ? "has-children" : ""}`}
              onMouseEnter={() => handleMouseEnter(menuKey)}
              onMouseLeave={handleMouseLeave}
            >
              <Link to={menu.path}>{menu.name}</Link>
              {menu.child && activeMenu === menuKey && (
                <div className="header_menu_dropdown">
                  <div className="dropdown_columns">
                    {menu.child.map((childItem, childKey) => (
                      <div
                        key={`${menuKey}-${childKey}`}
                        className="dropdown_column"
                      >
                        <h4>{childItem.name}</h4>
                        <ul className="sub_dropdown_list">
                          {/* Kiểm tra childItem.child trước khi dùng map */}
                          {childItem.child &&
                            childItem.child.map((subChild, subKey) => (
                              <li key={`${menuKey}-${childKey}-${subKey}`}>
                                <Link
                                  to={subChild.path}
                                  onClick={handleLinkClick} // Đóng menu khi nhấn vào link
                                >
                                  {subChild.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
    // <header class="flex border-b py-3 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[65px] tracking-wide relative z-50">
    //   <div class="flex flex-wrap items-center gap-4 max-w-screen-xl mx-auto w-full">
    //     <a href="javascript:void(0)" class="max-sm:hidden">
    //       <img
    //         src="https://readymadeui.com/readymadeui.svg"
    //         alt="logo"
    //         class="w-32"
    //       />
    //     </a>
    //     <a href="javascript:void(0)" class="hidden max-sm:block">
    //       <img
    //         src="https://readymadeui.com/readymadeui-short.svg"
    //         alt="logo"
    //         class="w-8"
    //       />
    //     </a>

    //     <div
    //       id="collapseMenu"
    //       class="max-lg:hidden lg:!block max-lg:w-full max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
    //     >
    //       <button
    //         id="toggleClose"
    //         class="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           class="w-3.5 h-3.5 fill-black"
    //           viewBox="0 0 320.591 320.591"
    //         >
    //           <path
    //             d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
    //             data-original="#000000"
    //           ></path>
    //           <path
    //             d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
    //             data-original="#000000"
    //           ></path>
    //         </svg>
    //       </button>

    //       <ul class="lg:flex lg:ml-14 lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
    //         <li class="mb-6 hidden max-lg:block">
    //           <a href="javascript:void(0)">
    //             <img
    //               src="https://readymadeui.com/readymadeui.svg"
    //               alt="logo"
    //               class="w-36"
    //             />
    //           </a>
    //         </li>
    //         <li class="max-lg:border-b max-lg:py-3 px-3">
    //           <a
    //             href="javascript:void(0)"
    //             class="lg:hover:text-[#007bff] text-[#007bff] block text-[15px]"
    //           >
    //             Home
    //           </a>
    //         </li>
    //         <li class="max-lg:border-b max-lg:py-3 px-3">
    //           <a
    //             href="javascript:void(0)"
    //             class="lg:hover:text-[#007bff] text-gray-800 block text-[15px]"
    //           >
    //             Team
    //           </a>
    //         </li>
    //         <li class="max-lg:border-b max-lg:py-3 px-3">
    //           <a
    //             href="javascript:void(0)"
    //             class="lg:hover:text-[#007bff] text-gray-800 block text-[15px]"
    //           >
    //             Feature
    //           </a>
    //         </li>
    //         <li class="max-lg:border-b max-lg:py-3 px-3">
    //           <a
    //             href="javascript:void(0)"
    //             class="lg:hover:text-[#007bff] text-gray-800 block text-[15px]"
    //           >
    //             Blog
    //           </a>
    //         </li>
    //         <li class="max-lg:border-b max-lg:py-3 px-3">
    //           <a
    //             href="javascript:void(0)"
    //             class="lg:hover:text-[#007bff] text-gray-800 block text-[15px]"
    //           >
    //             About
    //           </a>
    //         </li>
    //       </ul>
    //     </div>

    //     <div class="flex gap-4 ml-auto">
    //       <div class="flex max-w-xs w-full bg-gray-100 px-4 py-2 rounded outline outline-transparent border focus-within:border-blue-600 focus-within:bg-transparent transition-all">
    //         <input
    //           type="text"
    //           placeholder="Search something..."
    //           class="w-full text-sm bg-transparent rounded outline-none pr-2"
    //         />
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           viewBox="0 0 192.904 192.904"
    //           width="16px"
    //           class="cursor-pointer fill-gray-400"
    //         >
    //           <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
    //         </svg>
    //       </div>
    //       <button id="toggleOpen" class="lg:hidden">
    //         <svg
    //           class="w-7 h-7"
    //           fill="#000"
    //           viewBox="0 0 20 20"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             fill-rule="evenodd"
    //             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
    //             clip-rule="evenodd"
    //           ></path>
    //         </svg>
    //       </button>
    //     </div>
    //   </div>
    // </header>
  );
};

export default memo(Header);
