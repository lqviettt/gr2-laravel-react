import { Link } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import { useBreadcrumb } from "../BreadcrumbContext";
import "./breadcrumb.scss";

const Breadcrumb = () => {
  const { breadcrumbs, resetBreadcrumb } = useBreadcrumb();

  // Don't show breadcrumb if only home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleHomeClick = () => {
    resetBreadcrumb();
  };

  return (
    <nav className="breadcrumb-container bg-gray-50" aria-label="breadcrumb">
      <div className="breadcrumb-wrapper">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isClickable = item.clickable !== false; // Default to clickable if not specified

          return (
            <div key={index} className="breadcrumb-item-wrapper">
              {index > 0 && <MdChevronRight size={18} className="breadcrumb-separator" />}
              {isLast && !isClickable ? (
                <span className="breadcrumb-item breadcrumb-active">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.path}
                  className="breadcrumb-item breadcrumb-link"
                  onClick={index === 0 ? handleHomeClick : undefined}
                >
                  {item.name}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
