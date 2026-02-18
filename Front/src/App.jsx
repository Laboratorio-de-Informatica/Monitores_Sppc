import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/guards/PrivateRoute";
import AdminRoute from "./components/guards/AdminRoute";
import Login from "./pages/Login/Login";
import MonitorHome from "./pages/MonitorHome/MonitorHome";
import AdminPanel from "./pages/AdminPanel/AdminPanel";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/sessions"
            element={
              <PrivateRoute>
                <MonitorHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
