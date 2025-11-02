import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
  FaFilter,
} from "react-icons/fa";

const CommonTable = ({
  fields = {},
  items = [],
  showIndex = true,
  showId = false,
  sortableFields = [],
  hiddenOnMobile = [],
  onEdit,
  onDelete,
  onSort,
  filterModalId = "filterTableModal",
  availableFields = [],
  selectedFields = [],
  onFieldSelectionChange,
  tableId = "",
  disableHeader = false,
  indexByOrder = false,
  offset = 0,
  listTitle = {},
  routeDetection = "",
  fieldToSort = [],
  formId = "",
  routeToSort = "",
  method = "post",
}) => {
  const [sortField, setSortField] = useState("");

  const handleSort = (field) => {
    if (sortableFields.includes(field)) {
      setSortField(field);
      if (onSort) onSort(field);
    }
  };

  const getFieldTitle = (key) => {
    const keyTitle = listTitle[key] || key;
    // Giả sử có hàm translate, thay bằng logic thực tế
    return keyTitle; // Hoặc sử dụng i18n nếu có
  };

  const renderCell = (item, key, value) => {
    if (value === "pattern.tick") {
      return <FaCheck style={{ display: "none" }} />;
    } else if (value === "pattern.modified") {
      return (
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary mr-2"
            onClick={() => onEdit && onEdit(item.id)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="btn btn-danger"
            onClick={() => onDelete && onDelete(item.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      );
    } else if (value === "pattern.image") {
      return item.image ? (
        <img
          src={item.image}
          alt=""
          width="50"
          height="50"
          className="img-table"
        />
      ) : null;
    } else if (value.startsWith("pivot.")) {
      const pivotKey = value.replace("pivot.", "");
      return item.pivot ? item.pivot[pivotKey] || "" : "";
    } else if (value.startsWith("custom.")) {
      const customKey = value.replace("custom.", "");
      if (customKey === "product_names") {
        return (
          <div>
            {item.order_item.map((i) => (
              <div key={i.id}>{i.product_name}</div>
            ))}
          </div>
        );
      } else if (customKey === "variants") {
        return (
          <div>
            {item.order_item.map((i) => (
              <div key={i.id}>{i.product_variant_name}</div>
            ))}
          </div>
        );
      } else if (customKey === "category_names") {
        return (
          <div>
            {item.order_item.map((i) => (
              <div key={i.id}>{i.category_name || "N/A"}</div>
            ))}
          </div>
        );
      } else {
        return <span>Custom: {item[customKey]}</span>;
      }
    } else if (value === "indexing") {
      return items.indexOf(item) + 1 + offset;
    } else if (value.startsWith("link.")) {
      const displayKey = value.split(".")[1];
      return (
        <button
          className="text-decoration-none"
          style={{
            opacity: 1,
            border: "none",
            background: "none",
            color: "inherit",
            cursor: "pointer",
          }}
          onClick={() => {
            /* handle navigation */
          }}
        >
          {item[key] || item[displayKey]}
        </button>
      );
    } else if (value === "pattern.inactive-check") {
      // Giả sử logic inactive, thay bằng thực tế
      return item.isInactive ? (
        <FaExclamationTriangle className="text-danger" />
      ) : null;
    } else {
      // Giả sử có mapping cho value, thay bằng logic thực tế
      if (key === "total_price") {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(item[value]);
      }
      if (key === "status") {
        const statusValue = item[value] || item[key];
        let statusText = statusValue;
        let badgeClass = "bg-gray-100 text-gray-800";

        // Handle both integer and string status values
        switch (statusValue) {
          // Integer values
          case 1:
          case "1":
            statusText = "Hoạt động";
            badgeClass = "bg-green-100 text-green-800";
            break;
          case 0:
          case "0":
            statusText = "Không hoạt động";
            badgeClass = "bg-red-100 text-red-800";
            break;
          case "active":
            statusText = "Hoạt động";
            badgeClass = "bg-green-100 text-green-800";
            break;
          case "inactive":
            statusText = "Không hoạt động";
            badgeClass = "bg-red-100 text-red-800";
            break;
          case "pending":
            statusText = "Chờ xử lý";
            badgeClass = "bg-yellow-100 text-yellow-800";
            break;
          case "shipping":
            statusText = "Đang giao";
            badgeClass = "bg-blue-100 text-blue-800";
            break;
          case "delivered":
            statusText = "Đã giao";
            badgeClass = "bg-green-100 text-green-800";
            break;
          case "canceled":
            statusText = "Đã hủy";
            badgeClass = "bg-red-100 text-red-800";
            break;
          default:
            statusText = statusValue;
            break;
        }

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
          >
            {statusText}
          </span>
        );
      }
      return item[value] || item[key];
    }
  };

  return (
    <div className="d-flex position-relative">
      {fieldToSort.length > 0 && (
        <form id={formId} method={method} encType="multipart/form-data">
          <input type="hidden" name="field-table-to-sort" value={sortField} />
        </form>
      )}

      {/* <button
        type="button"
        className="btn btn-primary filter-table-btn"
        data-bs-toggle="modal"
        data-bs-target={`#${filterModalId}`}
      >
        <FaFilter />
      </button> */}

      <div
        className="table-responsive w-100"
        style={{ overflowX: "auto", maxWidth: "100%" }}
      >
        <table
          className="table table-hover table-stripped align-middle table-bordered"
          id={tableId}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
            minWidth: "600px",
          }}
        >
          {!disableHeader && (
            <thead
              className="table-header"
              style={{ backgroundColor: "#0d47a1", color: "#fff" }}
            >
              <tr>
                {showIndex && (
                  <th
                    className="text-nowrap orderNumber"
                    scope="col"
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px 12px",
                      ...(indexByOrder ? {} : { display: "none" }),
                    }}
                  >
                    STT
                  </th>
                )}
                {showId && (
                  <th
                    className="text-nowrap id"
                    scope="col"
                    style={{ border: "1px solid #ddd", padding: "8px 12px" }}
                  >
                    #
                  </th>
                )}
                {Object.entries(fields).map(([key, value]) => {
                  if (value === "pattern.tick") {
                    return (
                      <th
                        key={key}
                        className={`text-nowrap ${
                          hiddenOnMobile.includes(key) ? "hidden-on-mobile" : ""
                        }`}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px 12px",
                        }}
                      ></th>
                    );
                  } else {
                    return (
                      <th
                        key={key}
                        className={`text-nowrap ${key} ${
                          hiddenOnMobile.includes(key) ? "hidden-on-mobile" : ""
                        } ${
                          sortableFields.includes(key) ? "field-table-sort" : ""
                        }`}
                        scope="col"
                        title={getFieldTitle(key)}
                        onClick={() => handleSort(key)}
                        style={{
                          cursor: sortableFields.includes(key)
                            ? "pointer"
                            : "default",
                          border: "1px solid #ddd",
                          padding: "8px 12px",
                        }}
                      >
                        {getFieldTitle(key)}
                      </th>
                    );
                  }
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {items.map((item, index) => {
              const idx = index + 1 + offset;
              return (
                <tr
                  key={item.id}
                  className={item.custom_class_row ? "custom-class-row" : ""}
                >
                  {showIndex && (
                    <td
                      className="orderNumber border_table_common"
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px 12px",
                        ...(indexByOrder ? {} : { display: "none" }),
                      }}
                    >
                      {idx}
                    </td>
                  )}
                  {showId && (
                    <td
                      className="id border_table_common"
                      id={item.id}
                      style={{ border: "1px solid #ddd", padding: "8px 12px" }}
                    >
                      {item.id}
                    </td>
                  )}
                  {Object.entries(fields).map(([key, value]) => (
                    <td
                      key={key}
                      className={`border_table_common ${key} ${
                        hiddenOnMobile.includes(key) ? "hidden-on-mobile" : ""
                      }`}
                      title={item[value] || item[key]}
                      style={{ border: "1px solid #ddd", padding: "8px 12px" }}
                    >
                      {renderCell(item, key, value)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for field selection */}
      {availableFields.length > 0 && (
        <div
          className="modal fade"
          id={filterModalId}
          tabIndex="-1"
          aria-labelledby={`${filterModalId}Label`}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`${filterModalId}Label`}>
                  Chọn cột hiển thị
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {availableFields.map((field) => (
                  <div key={field} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`${filterModalId}-${field}`}
                      checked={selectedFields.includes(field)}
                      onChange={(e) =>
                        onFieldSelectionChange &&
                        onFieldSelectionChange(field, e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`${filterModalId}-${field}`}
                    >
                      {getFieldTitle(field)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
