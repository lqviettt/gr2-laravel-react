import { memo } from "react";
import Header from "../header";
import Footer from "../footer";
import { Breadcrumb } from "../../../../component/user";

const MasterLayout = ({ children, ...props }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Breadcrumb />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);