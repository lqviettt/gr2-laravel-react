import { memo, useState } from "react";
import "./style_h.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { BsClipboard2Check } from "react-icons/bs";
import { PiHandbag } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";
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

  const isLoggedIn = false; // Thay đổi giá trị này dựa trên trạng thái đăng nhập thực tế

  return (
    <header className="font-[sans-serif] min-h-[65px] tracking-wide relative z-50">
      <div className="flex justify-between items-center w-full bg-[#000000] text-white">
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
          <div className="menu_hotline flex items-center space-x-2 pt-5">
            <div className="icon pb-6">
              <FiPhone size={35} />
            </div>
            <div className="content">
              <a title="0981218999" href="tel:0981218907">
                Hotline <br />
                <span>0981218999</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center space-x-2 pt-5">
            <div className="icon pb-6">
              <LuMapPin size={35} />
            </div>
            <div className="content">
              <a title="Hệ thống cửa hàng" href="#">
                Hệ thống <br />
                <span>cửa hàng</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center space-x-2 pt-5">
            <div className="icon pb-6">
              <BsClipboard2Check size={35} />
            </div>
            <div className="content">
              <a href="#">
                Tra cứu <br />
                <span>đơn hàng</span>
              </a>
            </div>
          </div>
          <div className="menu_hotline flex items-center pt-5">
            <div className="icon pb-6">
              <PiHandbag size={35} />
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
              <div className="menu_info flex items-center space-x-2 text-white">
                <FaRegUserCircle size={27} />
                <span>Thông tin</span>
              </div>
              <ul className="submenu">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link to="#" className="flex items-center space-x-2">
                        <FaRegUserCircle size={25} className="text-black" />
                        <span className="mt-2">Tài khoản của tôi</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="flex items-center space-x-2">
                        <IoLogIn size={25} className="text-black" />
                        <span className="mt-2">Đăng xuất</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="#" className="flex items-center space-x-2">
                        <IoLogIn size={25} className="text-black" />
                        <span className="mt-2">Đăng nhập</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="" className="flex items-center space-x-2">
                        <FaUserPlus size={25} className="text-black" />
                        <span className="mt-2">Đăng ký</span>
                      </Link>
                    </li>
                  </>
                )}
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
                          {childItem.child &&
                            childItem.child.map((subChild, subKey) => (
                              <li key={`${menuKey}-${childKey}-${subKey}`}>
                                <Link
                                  to={subChild.path}
                                  onClick={handleLinkClick}
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
  );
};

export default memo(Header);
