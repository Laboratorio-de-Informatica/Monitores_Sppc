import { Navigate } from "react-router-dom";

function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = getUserRole();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== "ADMIN") {
    return <Navigate to="/sessions" replace />;
  }
  
  return children;
}

export default AdminRoute;
