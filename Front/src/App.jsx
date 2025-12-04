import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import MonitorHome from "./pages/MonitorHome";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sessions" element={
          <PrivateRoute>
            <MonitorHome />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
        {/* catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
