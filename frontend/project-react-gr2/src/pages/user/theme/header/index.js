import { memo, useState } from "react";
import "./style.scss";
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

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null); // Lưu trạng thái menu đang được hover

  const handleMouseEnter = (menuKey) => {
    setActiveMenu(menuKey); // Bật dropdown của menu được hover
  };

  const handleMouseLeave = () => {
    setActiveMenu(null); // Tắt dropdown khi rời khỏi menu
  };

  const handleLinkClick = () => {
    setActiveMenu(null);
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
            { name: "iPhone 16 Pro Max", path: ROUTERS.USER.PROFILE },
            { name: "iPhone 16 Pro", path: "/iphone-16-pro" },
            { name: "iPhone 16", path: "/iphone-16" },
          ],
        },
        {
          name: "iPhone 15 Series",
          child: [
            { name: "iPhone 15 Pro Max", path: "/iphone-15-pro-max" },
            { name: "iPhone 15 Pro", path: "/iphone-15-pro" },
            { name: "iPhone 15", path: "/iphone-15" },
          ],
        },
        {
          name: "iPhone 14 Series",
          child: [
            { name: "iPhone 14 Pro Max", path: "/iphone-15-pro-max" },
            { name: "iPhone 14 Pro", path: "/iphone-15-pro" },
            { name: "iPhone 14", path: "/iphone-15" },
          ],
        },
        {
          name: "iPhone 13 Series",
          child: [
            { name: "iPhone 13 Pro Max", path: "/iphone-15-pro-max" },
            { name: "iPhone 13 Pro", path: "/iphone-15-pro" },
            { name: "iPhone 13", path: "/iphone-15" },
          ],
        },
        {
          name: "iPhone 12 Series",
          child: [
            { name: "iPhone 12 Pro Max", path: "/iphone-15-pro-max" },
            { name: "iPhone 12 Pro", path: "/iphone-15-pro" },
            { name: "iPhone 12", path: "/iphone-15" },
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
    <header>
      <div className="container">
        <div className="h_top">
          <div className="row col-xl-3 col-lg-3">
            <div className="h_logo">
              <Link to="">
                <h1>React Shop</h1>
              </Link>
            </div>
          </div>

          <div className="row col-xl-6 col-lg-6">
            <div className="h_items">
              <div className="menu_search">
                <form action="" method="GET">
                  <input
                    type="text"
                    name="search"
                    placeholder="Tìm kiếm sản phẩm..."
                    required
                  />
                  <button type="submit">
                    <FaSearch />
                  </button>
                </form>
              </div>
              <div className="menu_hotline">
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
              <div className="menu_hotline">
                <div className="icon">
                  <SiGooglemaps />
                </div>
                <div className="content">
                  <a title="0981218999" href="tel:0981218907">
                    Hệ thống <br />
                    <span>cửa hàng</span>
                  </a>
                </div>
              </div>
              <div className="menu_hotline">
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
              <div className="menu_hotline">
                <div className="icon">
                  <PiHandbagFill />
                </div>
                <div className="content">
                  <a href="#">
                    Giỏ hàng <br />
                    <span>Sản phẩm</span> <span className="spanChild">6</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row col-xl-3 col-lg-3">
            <div className="h_account">
              <ul>
                <li className="menu_items">
                  <div className="menu_info">
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
                        {" "}
                        <FaUserPlus />
                        Đăng ký
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
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
      </div>
    </header>
  );
};

export default memo(Header);
