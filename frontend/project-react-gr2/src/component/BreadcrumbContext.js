import React, { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext();

export const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: "Trang chủ", path: "/" },
  ]);

  const setBreadcrumbTrail = (trail) => {
    // trail là mảng các object {name, path}
    // Luôn thêm Trang chủ ở đầu
    const withHome = [{ name: "Trang chủ", path: "/" }, ...trail];
    setBreadcrumbs(withHome);
  };

  const resetBreadcrumb = () => {
    // Reset breadcrumb to only home
    setBreadcrumbs([{ name: "Trang chủ", path: "/" }]);
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbTrail, resetBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
};
