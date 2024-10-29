import { memo } from "react";
import "./style.scss";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 name">
              <h3>Capyy Coffe&Tea</h3>
            </div>

            <div className="col-6 logo">
              {" "}
              Logoo <img></img>
            </div>

            <div className="col-6 search">
              <input
                type="text"
                className="search_input"
                placeholder="Bạn cần tìm sản phẩm gì? "
              ></input>
            </div>

            <div className="col-6 others">
              <ul>
                <li>
                  <Link to={""}>
                    <FaUser />
                  </Link>
                  <span>Login</span>
                </li>
                <li>
                  <Link to={""}>
                    <FaShoppingCart />
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
