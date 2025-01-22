import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    console.log("No token found. Redirecting to login...");
    console.log(token);
    return children;
  } else {
    console.log("Token exists. Access granted.");
  }
};

export default ProtectedRoute;
