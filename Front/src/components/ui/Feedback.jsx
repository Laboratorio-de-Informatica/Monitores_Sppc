import styles from "./Feedback.module.css";

export default function Feedback({ type = "error", message }) {
  if (!message) return null;
  const cls = `${styles.feedback} ${type === "success" ? styles.success : styles.error}`;
  return <div className={cls}>{message}</div>;
}
