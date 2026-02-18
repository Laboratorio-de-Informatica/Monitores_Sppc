import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SessionWorkspace from "../../components/session/SessionWorkspace";
import MonitorSidebar from "../../components/monitor/MonitorSidebar";
import styles from "./MonitorHome.module.css";

export default function MonitorHome() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSessionFinished = () => {
    setTimeout(() => navigate("/login", { replace: true }), 1200);
  };

  return (
    <div className={styles.layout}>
      {!isAdmin && (
        <MonitorSidebar user={user} onLogout={handleLogout} />
      )}
      <div className={styles.container}>
        {/* Header (only for admin) */}
        {isAdmin && (
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1>Sesión activa</h1>
              <p>{user?.username ? `Monitor: ${user.username}` : ""}</p>
            </div>
            <div className={styles.headerRight}>
              <button
                className={styles.btnNew}
                onClick={() => navigate("/admin")}
              >
                Panel Admin
              </button>
              <button className={styles.btnLogout} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </header>
        )}
        {/* Workspace de sesiones */}
        <SessionWorkspace onSessionFinished={handleSessionFinished} />
      </div>
    </div>
  );
}
