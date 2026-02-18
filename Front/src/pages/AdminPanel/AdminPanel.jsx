import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import FileUpload from "../../components/admin/FileUpload";
import InsightsOverview from "../../components/admin/InsightsOverview";
import SessionWorkspace from "../../components/session/SessionWorkspace";
import styles from "./AdminPanel.module.css";

const TAB_TITLES = {
  dashboard: "Sesiones",
  usuarios: "Carga Masiva de Usuarios",
  reportes: "Reportes",
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className={styles.layout}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.main}>
        <div className={styles.contentHeader}>
          <h1>{TAB_TITLES[activeTab] ?? activeTab}</h1>
        </div>

        <div className={styles.contentBody}>
          {activeTab === "dashboard" && <SessionWorkspace embedded />}

          {activeTab === "usuarios" && <FileUpload />}

          {activeTab === "reportes" && <InsightsOverview />}
        </div>
      </main>
    </div>
  );
}
