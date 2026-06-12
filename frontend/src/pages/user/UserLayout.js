import { Breadcrumb } from "../../../component/user";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />
      {children}
    </div>
  );
};

export default UserLayout;
