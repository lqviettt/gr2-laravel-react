import { memo, useState } from "react";
import "./style.scss";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router";

const Header = () => {
  const [menus, setMenus] = useState([
    {
      name: "Trang Chu",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Cua Hang",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "San Pham",
      path: "",
      isShowSubmenu: false,
      child: [
        {
          name: "Ca Phe",
          path: "",
        },
        {
          name: "Tra sua",
          path: "",
        },
      ],
    },
    {
      name: "Uu Dai",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Lien He",
      path: ROUTERS.USER.HOME,
    },
  ]);

  return (
    <header>
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3">
            <div className="h_logo">
              <h1>React Shop</h1>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6">
            <nav className="h_menu">
              <ul>
                {menus?.map((menu, menuKey) => (
                  <li key={menuKey}>
                    <Link to={menu?.path}>{menu?.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="col-xl-3 col-lg-3">
            <div className="h_others">
              <ul>
                <li>
                  <Link to={""}>
                    <FaUser />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to={""}>
                    <FaShoppingCart />
                    <span>5</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
