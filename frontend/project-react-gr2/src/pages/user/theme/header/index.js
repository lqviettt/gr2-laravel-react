import { memo, useState, useEffect, useCallback } from "react";
import "./style_h.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { BsClipboard2Check } from "react-icons/bs";
import { PiHandbag } from "react-icons/pi";
import { LuMapPin } from "react-icons/lu";
import { IoLogIn } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router";
import { useCart } from "../../../../component/CartContext";
import { api } from "../../../../utils/apiClient";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { cartItems } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  const searchTrends = [
    "iPhone 15",
    "iPhone 14",
    "iPhone 13",
    "Samsung Galaxy",
    "MacBook",
    "iPad",
    "AirPods",
    "Apple Watch"
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...');
        console.log('Fetching categories from API:', `${process.env.REACT_APP_API_URL}/category`);
        const response = await api.get('/category');
        console.log('Categories response status:', response.status);
        const data = response.data;
        console.log('Categories data:', data);
        if (data) {
          setCategories(data.data?.data || []);
          console.log('Categories set to:', data.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearchChange = useCallback(async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await api.get(`/product?search=${encodeURIComponent(query)}&perPage=10`);
        const data = response.data;
        let products = [];
        if (data.data?.data) {
          products = data.data.data;
        } else if (data.data) {
          products = data.data;
        } else if (Array.isArray(data)) {
          products = data;
        }
        setSearchResults(products);
        setShowSearchDropdown(products.length > 0);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
        setShowSearchDropdown(true);
      }
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  }, []);

  const handleSearchSubmit = (e, trendQuery = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const query = trendQuery || searchQuery;
    if (query.trim()) {
      navigate(`/product-list?search=${encodeURIComponent(query)}`);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
    setShowSearchDropdown(false);
  };

  const handleMouseEnter = (menuKey) => {
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleLinkClick = () => {
    setActiveMenu(null);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  // Group items theo series (12, 13, 14, 17, etc.)
  // Ví dụ: "iPhone 12" -> "12", "iPhone 17 Pro" -> "17", "Samsung A12" -> "12"
  const groupItemsBySeries = (items) => {
    const groups = {};
    items.forEach(item => {
      // Tìm số series trong tên (ví dụ: "12" từ "iPhone 12", "iPhone 12 Pro", "iPhone 17")
      const seriesMatch = item.name.match(/(\d+)/);
      const seriesKey = seriesMatch ? seriesMatch[1] : 'Other';

      if (!groups[seriesKey]) {
        groups[seriesKey] = [];
      }
      groups[seriesKey].push(item);
    });

    // Convert to array, sort by series number, giới hạn 5 groups
    const sortedGroups = Object.entries(groups)
      .sort(([a], [b]) => {
        // Sort "Other" to end, numbers ascending
        if (a === 'Other') return 1;
        if (b === 'Other') return -1;
        return parseInt(a) - parseInt(b);
      })
      .slice(0, 6); // Tối đa 5 cột

    const result = sortedGroups.map(([seriesName, items]) => ({
      name: seriesName === 'Other' ? 'Khác' : `iPhone ${seriesName} Series`,
      items: items.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 3) // Giới hạn 3 items mỗi cột
    }));

    return result;
  };

  // Build menus từ categories
  const buildMenus = () => {
    
    // Helper function để build nested structure
    const buildNestedCategories = (parentId = null) => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          ...cat,
          children: buildNestedCategories(cat.id)
        }));
    };
    
    const nestedCategories = buildNestedCategories();
    
    const dynamicMenus = nestedCategories.map(cat => {      
      // Thu thập tất cả sub-child items (items lá)
      const collectAllSubChildren = (children) => {
        let allItems = [];
        children.forEach(child => {
          if (child.children && child.children.length > 0) {
            // Nếu có sub-children, thêm chúng vào list
            child.children.forEach(subChild => {
              allItems.push({
                name: subChild.name,
                path: `/product?category_id=${subChild.id}`,
                group: child.name // Group theo tên parent
              });
            });
          } else {
            // Nếu không có sub-children, thêm child item
            allItems.push({
              name: child.name,
              path: `/product?category_id=${child.id}`,
              group: cat.name // Group theo tên grandparent
            });
          }
        });
        return allItems;
      };
      
      const allSubChildren = collectAllSubChildren(cat.children || []);
      
      const groupedColumns = groupItemsBySeries(allSubChildren);
      
      return {
        name: cat.name,
        path: `/product?category_id=${cat.id}`,
        columns: groupedColumns // Thay child bằng columns
      };
    });

    const finalMenus = [
      {
        name: "Trang chủ",
        path: ROUTERS.USER.HOME,
      },
      ...dynamicMenus,
    ];
    
    return finalMenus;
  };

  const menus = buildMenus();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", null);
    window.location.href = "/";
  };

  return (
    <header className="font-[sans-serif] min-h-[65px] tracking-wide relative z-50">
      <div className="flex justify-between lg:justify-between items-center w-full bg-[#000000] text-white px-4 sm:px-8 lg:px-32 py-4">
        <div className="h_top">
          <Link to="/">
            <h1 className="text-xl sm:text-2xl font-bold">QuocViet</h1>
          </Link>
        </div>

        {/* Mobile Search - visible on mobile */}
        <div className="lg:hidden flex-1 mx-4 relative search-container">
          <form onSubmit={handleSearchSubmit} className="flex rounded-full overflow-hidden border border-gray-300">
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm sản phẩm..."
              required
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="flex-1 px-3 py-1 border-0 text-black text-sm focus:outline-none bg-white"
            />
            <button type="submit" className="pr-3 rounded-r bg-white">
              <FaSearch color="black" />
            </button>
          </form>
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-[60] max-h-60 overflow-y-auto mt-1">
              {/* Trends Section */}
              <div className="p-2 border-b border-gray-100">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Xu hướng tìm kiếm</h4>
                <div className="grid grid-cols-2 gap-1">
                  {searchTrends.map((trend, index) => (
                    <span
                      key={index}
                      onClick={() => handleSearchSubmit(null, trend)}
                      className="text-left px-2 py-1 text-xs text-gray-600 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>

              {/* Search Results Section */}
              {searchQuery.length > 2 && searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={product.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}` : "/placeholder-image.jpg"}
                      alt={product.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.price ? `${product.price.toLocaleString()} VND` : "Liên hệ"}</p>
                    </div>
                  </div>
                ))
              ) : searchQuery.length > 0 && searchQuery.length <= 2 ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  Nhập thêm ký tự để tìm kiếm...
                </div>
              ) : (
                <div className="p-3 text-center text-sm text-gray-500">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className="hidden lg:flex h_items items-center space-x-4 lg:space-x-11">
          <div className="flex flex-col">
            {/* Search Input */}
            <div className="menu_search relative search-container">
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  required
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="p-4 rounded-l border border-gray-300 text-black bg-white"
                />
                <button type="submit" className="p-4 bg-blue-500 rounded-r">
                  <FaSearch />
                </button>
              </form>
              {showSearchDropdown && (
                <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-b shadow-lg z-[60] max-h-80 overflow-y-auto mt-1 min-w-[600px]">
                  {(() => {
                    console.log('Dropdown render:', { searchQuery, searchResults });
                    return null;
                  })()}

                  {/* Trends Section */}
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Xu hướng tìm kiếm</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {searchTrends.map((trend, index) => (
                        <span
                          key={index}
                          onClick={() => handleSearchSubmit(null, trend)}
                          className="text-left px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Search Results Section */}
                  {searchQuery.length > 2 && searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={product.image ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/storage/${product.image}` : "/placeholder-image.jpg"}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-600">{product.price ? `${product.price.toLocaleString()} VND` : "Liên hệ"}</p>
                        </div>
                      </div>
                    ))
                  ) : searchQuery.length > 0 && searchQuery.length <= 2 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Nhập thêm ký tự để tìm kiếm...
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Không tìm thấy sản phẩm nào
                    </div>
                  )}
                </div>
              )}
            </div>
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
              <a title="Hệ thống cửa hàng" href="/">
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
              <a href="/order-history">
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

        <div className="hidden lg:block h_account">
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
                      <a
                        href="my-account"
                        className="flex items-center space-x-2"
                      >
                        <FaRegUserCircle size={25} className="text-black" />
                        <span className="mt-2">Tài khoản</span>
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2"
                      >
                        <IoLogIn size={25} className="text-black" />
                        <span className="mt-2">Đăng xuất</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a href="/login" className="flex items-center space-x-2">
                        <IoLogIn size={25} className="text-black" />
                        <span className="mt-2">Đăng nhập</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/register"
                        className="flex items-center space-x-2"
                      >
                        <FaUserPlus size={25} className="text-black" />
                        <span className="mt-2">Đăng ký</span>
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <nav className="h_menu hidden md:block">
        <ul>
          {menus.map((menu, menuKey) => (
            <li
              key={menuKey}
              className={`menu_itemss ${menu.columns && menu.columns.length > 0 ? "has-children" : ""}`}
              onMouseEnter={() => handleMouseEnter(menuKey)}
              onMouseLeave={handleMouseLeave}
            >
              <a href={menu.path} className="block">{menu.name}</a>
              {menu.columns && menu.columns.length > 0 && activeMenu === menuKey && (
                <div className="header_menu_dropdown">
                  <div className="dropdown_columns">
                    {menu.columns.map((column, columnKey) => (
                      <div
                        key={`${menuKey}-${columnKey}`}
                        className="dropdown_column"
                      >
                        <h4>{column.name}</h4>
                        <ul className="sub_dropdown_list">
                          {column.items.map((item, itemKey) => (
                            <li key={`${menuKey}-${columnKey}-${itemKey}`}>
                              <a
                                href={item.path}
                                onClick={handleLinkClick}
                                className="block py-1 hover:text-blue-600"
                              >
                                {item.name}
                              </a>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#000000] text-white z-40">
          <div className="px-4 py-4">

            {/* Mobile Menu Items */}
            <ul className="space-y-2">
              {menus.map((menu, menuKey) => (
                <li key={menuKey}>
                  <a
                    href={menu.path}
                    className="block py-2 px-4 hover:bg-gray-800 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Quick Links */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
              <a
                href="/order-history"
                className="block py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BsClipboard2Check size={20} />
                <span>Tra cứu đơn hàng</span>
              </a>
              <a
                href="/cart"
                className="block py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PiHandbag size={20} />
                <span>Giỏ hàng ({totalQuantity})</span>
              </a>
            </div>

             {/* Mobile Account */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <a
                    href="my-account"
                    className="block py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaRegUserCircle size={20} />
                    <span>Tài khoản</span>
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                  >
                    <IoLogIn size={20} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <a
                    href="/login"
                    className="block py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IoLogIn size={20} />
                    <span>Đăng nhập</span>
                  </a>
                  <a
                    href="/register"
                    className="block py-2 px-4 hover:bg-gray-800 rounded flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserPlus size={20} />
                    <span>Đăng ký</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default memo(Header);
