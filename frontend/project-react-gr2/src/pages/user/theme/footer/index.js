import { memo } from "react";
import "./style.scss";

const Footer = () => {
  return (
    <footer class="footer">
      <div class="footer-content">
        <ul class="list-inline">
          <li>
            <p>Giới thiệu về Coffee & tea</p>
            <p>Nhượng quyền</p>
            <p>Tin tức khuyến mại</p>
            <p>Cửa hàng</p>
            <p>Quy định chung</p>
          </li>
          <li>
            <p>Hình thức thanh toán</p>
            <p>Vận chuyển giao nhận</p>
            <p>Đổi trả và hoàn tiền</p>
            <p>Bảo vệ thông tin cá nhân</p>
            <p>Cơ sở gần nhất</p>
          </li>
          <li>
            <p>hom nay</p>
            <p>mai</p>
          </li>
        </ul>
      </div>
      <div class="coppy-right">
        Địa chỉ: Hưng Yên
        <h1> Hotline: 0981218907</h1>
      </div>
    </footer>
  );
};

export default memo(Footer);
