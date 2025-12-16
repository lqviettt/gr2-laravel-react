import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/user/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/user/theme/masterLayout";
import AdminLayout from "./pages/admin/theme/adminLayout/index.js";
import ProfilePage from "./pages/user/profilePage";
import ProductPage from "./pages/user/productPage";
import ProductDetail from "./pages/user/productDetail";
import ProductList from "./pages/user/productList/index.js";
import Login from "./pages/user/loginPage/index.js";
import Register from "./pages/user/registerPage/index.js";
import CategoryManageAdd from "./pages/admin/categoryManage/categoryAdd.js";
import CategoryManageList from "./pages/admin/categoryManage/categoryList.js";
import Cart from "./pages/user/cartPage/index.js";
import OrderManageList from "./pages/admin/orderManage/orderList.js";
import OrderManageAdd from "./pages/admin/orderManage/orderAdd.js";
import Checkout from "./pages/user/checkoutPage/index.js";
import ProtectedRoute from "./utils/protectedRoute";
import PaymentInfo from "./pages/user/paymentInfo/index.js";
import ProductManageAdd from "./pages/admin/productManage/productAdd.js";
import ProductManageList from "./pages/admin/productManage/productList.js";
import AccountManageAdd from "./pages/admin/accountManage/accountAdd.js";
import AccountManageList from "./pages/admin/accountManage/accountList.js";
import VerifyAccount from "./pages/user/registerPage/verify.js";
import AdminDashboard from "./pages/admin/dashboard/index.js";
import UploadDemo from "./pages/UploadDemo";
import OrderHistoryPage from "./pages/user/orderHistoryPage/index.js";

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PROFILE,
      component: <ProfilePage />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PRODUCT,
      component: <ProductPage />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PRODUCT_DETAIL,
      component: <ProductDetail />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PRODUCT_LIST,
      component: <ProductList />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PRODUCT_DETAIL,
      component: <ProductDetail />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.LOGIN,
      component: <Login />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.REGISTER,
      component: <Register />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.MY_ACCOUNT,
      component: <ProfilePage />,
      layout: MasterLayout,
      protected: true,
    },
    {
      path: ROUTERS.USER.CART,
      component: <Cart />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.CHECKOUT,
      component: <Checkout />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.PAYMENT_INFO,
      component: <PaymentInfo />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.ORDER_HISTORY,
      component: <OrderHistoryPage />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.VERIFY_ACCOUNT,
      component: <VerifyAccount />,
      layout: MasterLayout,
    },
    {
      path: ROUTERS.USER.UPLOAD_DEMO,
      component: <UploadDemo />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.HOME,
      component: <AdminDashboard />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.DASHBOARD,
      component: <AdminDashboard />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGE_ADD,
      component: <CategoryManageAdd />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGE_LIST,
      component: <CategoryManageList />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.ORDER_MANAGE_LIST,
      component: <OrderManageList />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.ORDER_MANAGE_ADD,
      component: <OrderManageAdd />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.PRODUCT_MANAGE_ADD,
      component: <ProductManageAdd />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.PRODUCT_MANAGE_LIST,
      component: <ProductManageList />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.ACCOUNT_MANAGE_ADD,
      component: <AccountManageAdd />,
      layout: AdminLayout,
      protected: true,
    },
    {
      path: ROUTERS.ADMIN.ACCOUNT_MANAGE_LIST,
      component: <AccountManageList />,
      layout: AdminLayout,
      protected: true,
    },

  ];

  return (
    <Routes>
      {userRouters.map((item, key) => {
        const Layout = item.layout || React.Fragment;
        const Element = item.protected ? (
          <ProtectedRoute>{item.component}</ProtectedRoute>
        ) : (
          item.component
        );

        return (
          <Route
            key={key}
            path={item.path}
            element={<Layout>{Element}</Layout>}
          />
        );
      })}
    </Routes>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
