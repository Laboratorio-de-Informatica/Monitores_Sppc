import { useState, useRef } from "react";
import { uploadMonitors } from "../../services/monitorService";
import styles from "./FileUpload.module.css";

const VALID_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [overwrite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!VALID_TYPES.includes(f.type) && !f.name.endsWith(".xlsx")) {
      setError("Selecciona un archivo Excel (.xlsx)");
      setFile(null);
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return setError("Selecciona un archivo");
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const data = await uploadMonitors(file, overwrite);
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="56" height="56">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
          </svg>
        </div>
        <h3>Arrastra tu archivo Excel aquí</h3>
        <p>Formatos aceptados: .xlsx, .xls</p>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
          hidden
        />
        <button
          className={styles.btnSelect}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Seleccionar archivo
        </button>

        {file && (
          <div className={styles.fileInfo}>
            ✓ {file.name}
          </div>
        )}

        <div className={styles.templateHint}>
          <h4>Columnas requeridas</h4>
          <p>email, name, password, role</p>
        </div>
      </div>

      {result && (
        <div className={styles.result}>
          ✓ Se cargaron {result.inserted ?? result.created ?? 0} usuarios correctamente.
          {result.updated > 0 && ` (${result.updated} actualizados)`}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <h4>Error</h4>
          <p>{error}</p>
          {result?.errors?.length > 0 && (
            <ul>
              {result.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        className={styles.btnUpload}
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Cargando…" : "Cargar Usuarios"}
      </button>
    </>
  );
}
