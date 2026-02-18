import { useState } from "react";
import styles from "./StudentForm.module.css";

export default function StudentForm({ students, loading, onAdd }) {
  const [idInput, setIdInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [programInput, setProgramInput] = useState("");

  const handleAdd = () => {
    const id = idInput.trim();
    const name = nameInput.trim();
    if (!id || !name) return;
    onAdd({ id, name, program: programInput.trim() });
    setIdInput("");
    setNameInput("");
    setProgramInput("");
  };

  return (
    <div className={styles.wrapper}>
      <h3>Agregar estudiante</h3>

      <div className={styles.form}>
        <input
          placeholder="ID / Carnet"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
        />
        <input
          placeholder="Nombre completo"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          placeholder="Programa (opcional)"
          value={programInput}
          onChange={(e) => setProgramInput(e.target.value)}
        />
        <button
          className={styles.btnAdd}
          onClick={handleAdd}
          disabled={loading || !idInput.trim() || !nameInput.trim()}
        >
          Agregar
        </button>
      </div>

      {students.length === 0 ? (
        <p className={styles.empty}>No hay estudiantes añadidos</p>
      ) : (
        <ul className={styles.list}>
          {students.map((s, i) => (
            <li key={i}>
              {s.id} — {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
