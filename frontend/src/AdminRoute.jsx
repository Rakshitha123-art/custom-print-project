import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin");

  return isAdmin === "true" ? children : <Navigate to="/login" />;
}

export default AdminRoute;