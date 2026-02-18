import styles from "./MonitorSidebar.module.css";

export default function MonitorSidebar({ user, onLogout }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>🧑‍🏫</div>
        <h3>{user?.username || "Monitor"}</h3>
        <p>MoniTrack</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.btnLogout} onClick={onLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
