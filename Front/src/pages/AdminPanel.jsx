import { useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import InsightsOverview from "./InsightsOverview";
import "../style/AdminPanel.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [file, setFile] = useState(null);
  const [overwrite, setOverwrite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar que sea Excel
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
      ];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.xlsx')) {
        setError("Por favor selecciona un archivo Excel (.xlsx)");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor selecciona un archivo");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("overwrite", overwrite);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/monitors/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          throw new Error("No tienes permisos de administrador");
        }
        throw new Error("Error al subir el archivo");
      }

      const data = await response.json();
      setResult(data);
      setFile(null);
      // Reset file input
      document.getElementById("file-input").value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <h3>Admin Panel</h3>
          <p className="sidebar-subtitle">Gestión de Contenidos</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === "dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("dashboard")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            Dashboard
          </button>
          
          <button 
            className={activeTab === "usuarios" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("usuarios")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Usuarios
          </button>
          
          <button 
            className={activeTab === "reportes" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("reportes")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            Reportes
          </button>
          
          <button 
            className={activeTab === "config" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("config")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-new-report">
            + Nuevo Reporte
          </button>
          <button className="sidebar-help">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
            Ayuda
          </button>
          <button className="sidebar-logout" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Salir
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="content-header">
          <h1>
            {activeTab === "dashboard" && "Dashboard"}
            {activeTab === "usuarios" && "Carga Masiva de Usuarios por Excel"}
            {activeTab === "reportes" && "Reportes"}
            {activeTab === "config" && "Configuración"}
          </h1>
        </div>

        {activeTab === "usuarios" && (
          <div className="content-body">
            <div className="upload-card">
              <div className="upload-area">
                <div className="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                  </svg>
                </div>
                <h3>Arrastra y suelta tu archivo Excel aquí</h3>
                <p>o haz clic en el botón para seleccionar. Formatos aceptados: .xlsx, .xls</p>
                
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn-select-file"
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={uploading}
                >
                  Seleccionar Archivo
                </button>

                {file && (
                  <div className="file-selected-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>{file.name}</span>
                  </div>
                )}
              </div>

              <div className="template-info">
                <h4>¿No tienes la plantilla? Descárgala aquí</h4>
                <p>El archivo debe tener las siguientes columnas: email, name, password, role</p>
              </div>
            </div>

            {uploading && (
              <div className="upload-progress">
                <h3>Estado de la Carga</h3>
                <div className="progress-info">
                  <p>Cargando archivo...</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <p className="progress-filename">{file?.name}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="upload-result">
                <div className="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <p>¡Éxito!</p>
                </div>
                <p className="success-detail">Se han cargado {result.created} usuarios correctamente.</p>
              </div>
            )}

            {error && (
              <div className="upload-error">
                <div className="error-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <h4>Error de Validación</h4>
                <p>Se encontraron problemas en el archivo. Por favor, corrige los siguientes errores y vuelve a intentarlo:</p>
                <ul>
                  <li>{error}</li>
                  {result?.errors?.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="btn-upload-main"
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? "Cargando..." : "Cargar Usuarios"}
            </button>
          </div>
        )}

        {activeTab === "reportes" && (
          <div className="content-body">
            <InsightsOverview />
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="content-body">
            <div className="dashboard-placeholder">
              <h3>Dashboard en construcción</h3>
              <p>Aquí se mostrarán estadísticas generales del sistema.</p>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="content-body">
            <div className="dashboard-placeholder">
              <h3>Configuración</h3>
              <p>Opciones de configuración del sistema.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
