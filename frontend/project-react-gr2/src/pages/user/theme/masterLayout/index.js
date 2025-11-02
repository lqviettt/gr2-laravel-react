import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const MasterLayout = ({ children, ...props }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default memo(MasterLayout);
