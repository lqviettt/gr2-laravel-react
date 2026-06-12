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
import { useDebounce } from "../../../../utils/useDebounce";
import { toast } from "react-toastify";
import { useCategoryProductsCache } from "../../../../utils/useCategoryProductsCache";
import { useBreadcrumb } from "../../../../component/BreadcrumbContext";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { cartItems } = useCart();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { setBreadcrumbTrail } = useBreadcrumb();
  const navigate = useNavigate();
  
  // Use centralized cache hook for category products
  const { categoryProducts, fetchCategoryProducts, clearCache } = useCategoryProductsCache();

  const searchTrends = [
    "iPhone 17 Pro Max",
    "iPhone 17",
    "iPhone 15 Pro",
    "Tai nghe Bluetooth",
    "AirPods",
    "Tai nghe dây"
  ];

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/category?status=1');
        const data = response.data;
        if (data) {
          setCategories(data.data?.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryHover = useCallback(async (categoryId) => {
    await fetchCategoryProducts(categoryId);
  }, [fetchCategoryProducts]);

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

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length > 2) {
      const performSearch = async () => {
        try {
          const response = await api.get(
            `/product?search=${encodeURIComponent(debouncedSearchQuery)}&perPage=10&status=1`,
            { cacheDuration: 10 * 60 * 1000 } // Cache for 10 min
          );
          
          let products = [];
          if (response.data?.data?.data) {
            products = response.data.data.data;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            products = response.data.data;
          } else if (Array.isArray(response.data)) {
            products = response.data;
          }
          
          setSearchResults(products);
          setShowSearchDropdown(products.length > 0);
        } catch (error) {
          console.error("Error searching products:", error);
          setSearchResults([]);
          setShowSearchDropdown(true);
        }
      };
      
      performSearch();
    } else {
      setShowSearchDropdown(false);
      setSearchResults([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }, []);

  const handleSearchSubmit = (e, trendQuery = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const query = trendQuery || searchQuery;
    if (query.trim()) {
      navigate(`/product-list?search=${encodeURIComponent(query)}`);
      setShowSearchDropdown(false);
    } else {
      // Toggle dropdown if no query
      setShowSearchDropdown(!showSearchDropdown);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  const handleProductClick = (productId) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
    console.log('Navigating to product ID:', productId);
    navigate(`/product-detail/${productId}`);
  };

  const handleMouseEnter = useCallback((menuKey, menu) => {
    setActiveMenu(menuKey);
    // Fetch category products on hover if it's a category type menu
    if (menu && menu.type === 'category' && menu.columns) {
      menu.columns.forEach(column => {
        if (column.id && column.items.length === 0) {
          handleCategoryHover(column.id);
        }
      });
    }
  }, [handleCategoryHover]);

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


  const groupItemsBySeries = (items) => {
    const groups = {};
    items.forEach(item => {
      const seriesMatch = item.name.match(/(\d+)/);
      const seriesKey = seriesMatch ? seriesMatch[1] : 'Other';

      if (!groups[seriesKey]) {
        groups[seriesKey] = [];
      }
      groups[seriesKey].push(item);
    });

    const sortedGroups = Object.entries(groups)
      .sort(([a], [b]) => {
        if (a === 'Other') return 1;
        if (b === 'Other') return -1;
        return parseInt(a) - parseInt(b);
      })
      .slice(0, 6);

    const result = sortedGroups.map(([seriesName, items]) => ({
      name: seriesName === 'Other' ? 'Khác' : `iPhone ${seriesName} Series`,
      items: items.sort((a, b) => a.name.localeCompare(b.name))
    }));

    return result;
  };

  const groupChildCategoriesWithProducts = useCallback((parentCategoryId) => {
    const childCategories = categories.filter(cat => cat.parent_id === parentCategoryId);
    
    return childCategories.map(childCat => ({
      name: childCat.name,
      id: childCat.id,
      items: categoryProducts[childCat.id] || [],
      link: `/product?category_id=${childCat.id}&status=1`
    }));
  }, [categories, categoryProducts]);

  const buildMenus = useCallback(() => {
    // These categories exist in DB but should NOT behave like product categories.
    // We'll render them as static pages instead (see finalMenus below).
    const EXCLUDED_DYNAMIC_MENU_NAMES = new Set([
      "Chính sách đổi trả, lên đời",
      "Chính sách bảo hành",
      "Liên hệ",
    ]);
    const normalized = (s) => (s || "").toString().trim().toLowerCase();
    
    const buildNestedCategories = (parentId = null) => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          ...cat,
          children: buildNestedCategories(cat.id)
        }));
    };
    
    const nestedCategories = buildNestedCategories().filter((cat) => {
      const name = normalized(cat?.name);
      return ![...EXCLUDED_DYNAMIC_MENU_NAMES].some((n) => normalized(n) === name);
    });
    
    const dynamicMenus = nestedCategories.map(cat => {
      if (cat.id === 103) {
        const collectAllSubChildren = (children) => {
          let allItems = [];
          children.forEach(child => {
            if (child.children && child.children.length > 0) {
              child.children.forEach(subChild => {
                allItems.push({
                  name: subChild.name,
                  path: `/product?category_id=${subChild.id}&parent_id=${child.id}&status=1`,
                  group: child.name
                });
              });
            } else {
              allItems.push({
                name: child.name,
                path: `/product?category_id=${child.id}&parent_id=${cat.id}&status=1`,
                group: cat.name
              });
            }
          });
          return allItems;
        };
        
        const allSubChildren = collectAllSubChildren(cat.children || []);
        const groupedColumns = groupItemsBySeries(allSubChildren);
        
        return {
          name: cat.name,
          path: `/product?category_id=${cat.id}&status=1`,
          columns: groupedColumns,
          type: 'series' // Mark as series type
        };
      } else {
        // LOGIC MỚI: Phụ kiện & Linh kiện - Display child categories with products
        const childColumnsWithProducts = groupChildCategoriesWithProducts(cat.id);
        
        return {
          name: cat.name,
          path: `/product?category_id=${cat.id}&status=1`,
          columns: childColumnsWithProducts,
          type: 'category' // Mark as category type
        };
      }
    });

    const finalMenus = [
      {
        name: "Trang chủ",
        path: ROUTERS.USER.HOME,
      },
      ...dynamicMenus,
      {
        name: "Chính sách đổi trả, lên đời",
        path: `/${ROUTERS.USER.SWAP}`,
      },
      {
        name: "Chính sách bảo hành",
        path: `/${ROUTERS.USER.WARRANTY_POLICY}`,
      },
      {
        name: "Liên hệ",
        path: `/${ROUTERS.USER.CONTACT}`,
      },
    ];
    
    return finalMenus;
  }, [categories, groupChildCategoriesWithProducts]);

  const menus = buildMenus();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("token", null);
    clearCache();
    window.location.href = "/login";
  };

  const handleSocial = (provider) => {
    toast.info(`Tính năng ${provider} chưa được triển khai`);
  };

  const handleClickLogo = () => {
    setBreadcrumbTrail([]);
    navigate('/');
  };

  return (
    <header className="font-[sans-serif] min-h-[65px] tracking-wide relative z-50">
      <div className="flex justify-between lg:justify-between items-center w-full bg-[#000000] text-white sm:px-8 lg:px-12 py-4 hehe">
        {/* Logo */}
          <div className="w-24 lg:w-32 flex items-center cursor-pointer ">
            <button className="w-full" title="QuocViet Logo" onClick={() => {handleClickLogo()}}>
              <img
                src={`${process.env.REACT_APP_LARAVEL_APP}/storage/banners/logo-nobg.png`}
                alt="QuocViet Logo"
                className="w-full lg:h-32 object-contain"
              />
            </button>
          </div>

          {/* Mobile Search - visible on mobile */}
        <div className="lg:hidden flex-1 mx-2 relative search-container max-w-xs">
          <form onSubmit={handleSearchSubmit} className="flex rounded-full overflow-hidden border border-gray-300">
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm..."
              required
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="flex-1 px-2 py-2 text-black text-xs bg-white rounded-none border-0 focus:outline-none"
            />
            <button type="submit" className="pr-2 pl-2 rounded-r bg-white">
              <FaSearch color="black" size={16} />
            </button>
          </form>
          {showSearchDropdown && (
            <div className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-[60] max-h-60 overflow-y-auto">
              {/* Trends Section */}
              {/* <div className="p-2 border-b border-gray-100">
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
              </div> */}

              {/* Search Results Section */}
              {searchQuery.length > 2 && searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={product.image ? `${process.env.REACT_APP_LARAVEL_APP}/storage/${product.image}` : "/placeholder-image.jpg"}
                      alt={product.name}
                      title={product.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-gray-800 truncate">{product.name}</h4>
                      <p className="text-xs text-gray-600">{product.price ? `${(product.price * 1000).toLocaleString()} VND` : "Liên hệ"}</p>
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
          className="lg:hidden text-white p-2 flex-shrink-0"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

          <div className="flex flex-col hidden lg:block">
            {/* Search Input */}
            <div className="relative hihi search-container">
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  name="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  required
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="p-4 rounded-l border-gray-300 text-black text-xs bg-white h-12 focus:outline-none"
                />
                <button type="submit" className="p-4 rounded-r bg-white hover:bg-opacity-100 text-black">
                  <FaSearch />
                </button>
              </form>
              {showSearchDropdown && (
                <div className="absolute top-23 left-0 bg-white border border-gray-300 rounded-b shadow-lg z-[60] max-h-80 overflow-y-auto min-w-[400px]">
                  {/* Trends Section */}
                  {/* <div className="p-4 border-b border-gray-100">
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
                  </div> */}

                  {/* Search Results Section */}
                  {searchQuery.length > 2 && searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer w-full border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={product.image ? `${process.env.REACT_APP_LARAVEL_APP}/storage/${product.image}` : "/placeholder-image.jpg"}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
                          <p className="text-xs text-gray-600">{product.price ? `${(product.price * 1000).toLocaleString()} VND` : "Liên hệ"}</p>
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

        <div className="hidden lg:flex h_items items-center space-x-4 lg:space-x-6">
          <div className="menu_hotline flex items-center space-x-2 pt-5">
            <div className="icon pb-6">
              <FiPhone size={25} />
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
              <LuMapPin size={25} />
            </div>
            <div className="content">
              <button onClick={() => {handleSocial('Cửa hàng')}}>
                <a title="Hệ thống cửa hàng">
                  Hệ thống <br />
                  <span>cửa hàng</span>
                </a>
              </button>
            </div>
          </div>
          <div className="menu_hotline flex items-center space-x-2 pt-5">
            <div className="icon pb-6">
              <BsClipboard2Check size={25} />
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
              <PiHandbag size={25} />
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
                <FaRegUserCircle size={20} />
                <span>Thông tin</span>
              </div>
              <ul className="submenu">
                {isLoggedIn ? (
                  <>
                    <li>
                      <a
                        href="/my-account"
                        className="flex items-center space-x-2"
                      >
                        <FaRegUserCircle size={20} className="text-black" />
                        <span className="mt-2">Tài khoản</span>
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2"
                      >
                        <IoLogIn size={20} className="text-black" />
                        <span className="mt-2">Đăng xuất</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a href="/login" className="flex items-center space-x-2">
                        <IoLogIn size={20} className="text-black text-sm" />
                        <span className="mt-2">Đăng nhập</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="/register"
                        className="flex items-center space-x-2"
                      >
                        <FaUserPlus size={20} className="text-black text-sm" />
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

      <nav className="h_menu hidden lg:block">
        <ul>
          {menus.map((menu, menuKey) => (
            <li
              key={menuKey}
              className={`menu_itemss ${menu.columns && menu.columns.length > 0 ? "has-children" : ""}`}
              onMouseEnter={() => handleMouseEnter(menuKey, menu)}
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
                        <h4>
                          {menu.type === 'category' ? (
                            <a href={column.link} className="text-blue-600">
                              {column.name}
                            </a>
                          ) : (
                            column.name
                          )}
                        </h4>
                        <ul className="sub_dropdown_list">
                          {column.items && column.items.length > 0 ? (
                            column.items.map((item, itemKey) => (
                              <li key={`${menuKey}-${columnKey}-${itemKey}`}>
                                <a
                                  href={menu.type === 'series' ? item.path : `/product-detail/${item.id}`}
                                  onClick={handleLinkClick}
                                  className="block py-1 hover:text-blue-600 text-sm"
                                >
                                  {item.name}
                                </a>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400 text-sm py-1"></li>
                          )}
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
