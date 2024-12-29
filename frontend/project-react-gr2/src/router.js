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
      path: ROUTERS.ADMIN.HOME,
      component: <CategoryManageAdd />,
      layout: AdminLayout,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGE_ADD,
      component: <CategoryManageAdd />,
      layout: AdminLayout,
    },
    {
      path: ROUTERS.ADMIN.CATEGORY_MANAGE_LIST,
      component: <CategoryManageList />,
      layout: AdminLayout,
    },
  ];

  return (
    <Routes>
      {userRouters.map((item, key) => {
        const Layout = item.layout || React.Fragment;
        return (
          <Route
            key={key}
            path={item.path}
            element={<Layout>{item.component}</Layout>}
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
