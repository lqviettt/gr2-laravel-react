import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "./axiosClient";

/**
 * ProtectedRoute
 * - Checks login based on localStorage token.
 * - Optionally checks admin role via GET /profile.
 *
 * Usage:
 *   <ProtectedRoute>{children}</ProtectedRoute>
 *   <ProtectedRoute requireAdmin>{children}</ProtectedRoute>
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Not logged in
    if (!token) {
      toast.error("Bạn cần đăng nhập để tiếp tục.");
      navigate("/login", { replace: true, state: { from: location.pathname } });
      return;
    }

    // Logged in, but admin-only page
    if (requireAdmin) {
      (async () => {
        try {
          const res = await axiosClient.get("/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const isAdmin = Boolean(res?.data?.is_admin);
          if (!isAdmin) {
            toast.error("Bạn không có quyền truy cập trang quản trị.");
            navigate("/", { replace: true });
          }
        } catch (e) {
          // If profile cannot be fetched, treat as unauthorized
          toast.error("Không thể xác thực quyền truy cập. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          localStorage.setItem("isLoggedIn", "false");
          navigate("/login", { replace: true, state: { from: location.pathname } });
        }
      })();
    }
  }, [token, requireAdmin, navigate, location.pathname]);

  // Render nothing while redirecting/auth-checking.
  if (!token) return <Navigate to="/login" replace />;

  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
