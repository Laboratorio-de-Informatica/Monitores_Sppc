import { useState } from "react";
import styles from "./SessionModal.module.css";

export default function SessionModal({ open, loading, onClose, onCreate }) {
  const [topic, setTopic] = useState("");
  const [course, setCourse] = useState("");
  const [name, setName] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (topic.trim().length < 2) return;
    onCreate({ topic, course, name: name || topic });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2>Nueva sesión de monitoria</h2>

        <div className={styles.field}>
          <label htmlFor="sessionTopic">Tema</label>
          <input
            id="sessionTopic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Testing unitario"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="sessionCourse">Materia</label>
          <input
            id="sessionCourse"
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Ej: PDSW"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="sessionName">Nombre de la sesión (opcional)</label>
          <input
            id="sessionName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Sesión repaso parcial 2"
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnGhost}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleCreate}
            disabled={loading || topic.trim().length < 2}
          >
            {loading ? "Creando…" : "Crear sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
