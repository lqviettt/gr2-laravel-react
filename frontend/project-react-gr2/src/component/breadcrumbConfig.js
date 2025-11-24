// Các page breadcrumb configurations
export const pageBreadcrumbs = {
  cart: [
    { name: "Giỏ hàng", path: "/cart" },
  ],
  checkout: [
    { name: "Giỏ hàng", path: "/cart" },
    { name: "Thanh toán", path: "/checkout" },
  ],
  "order-history": [
    { name: "Lịch sử đơn hàng", path: "/order-history" },
  ],
  profile: [
    { name: "Hồ sơ cá nhân", path: "/profile" },
  ],
  "my-account": [
    { name: "Tài khoản của tôi", path: "/my-account" },
  ],
  "payment-info": [
    { name: "Thông tin thanh toán", path: "/payment-info" },
  ],
  login: [
    { name: "Đăng nhập", path: "/login" },
  ],
  register: [
    { name: "Đăng ký", path: "/register" },
  ],
  "reset-password": [
    { name: "Đặt lại mật khẩu", path: "/reset-password" },
  ],
  product: [
    { name: "Sản phẩm", path: "/product" },
  ],
};

// Hook để set breadcrumb dễ dàng
export const useSetPageBreadcrumb = (pageName) => {
  const { useBreadcrumb } = require("./BreadcrumbContext");
  const { setBreadcrumbTrail } = useBreadcrumb();

  const breadcrumbs = pageBreadcrumbs[pageName];
  if (breadcrumbs) {
    setBreadcrumbTrail(breadcrumbs);
  }
};
