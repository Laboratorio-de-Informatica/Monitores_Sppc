import { useState } from "react";
import styles from "./LogBookEditor.module.css";

export default function LogBookEditor({ loading, onSave }) {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim().length < 3) return;
    onSave(text);
    setText("");
  };

  return (
    <div className={styles.wrapper}>
      <h3>Bitácora</h3>

      <textarea
        className={styles.textarea}
        rows={6}
        placeholder="Describe lo ocurrido en la sesión…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className={styles.actions}>
        <button
          className={styles.btnSave}
          onClick={handleSave}
          disabled={loading || text.trim().length < 3}
        >
          Guardar bitácora
        </button>
        <button className={styles.btnClear} onClick={() => setText("")}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
