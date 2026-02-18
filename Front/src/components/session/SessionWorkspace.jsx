import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createSession,
  addStudent,
  finishSession,
} from "../../services/logBookService";
import SessionModal from "./SessionModal";
import StudentForm from "./StudentForm";
import Feedback from "../ui/Feedback";
import styles from "./SessionWorkspace.module.css";


export default function SessionWorkspace({ embedded = false, onSessionFinished }) {
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(!embedded);
  const [sessionId, setSessionId] = useState(null);
  const [topic, setTopic] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 2500);
  };


  const handleCreate = useCallback(
    async ({ topic: topicText, course, name }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await createSession({
          topic: topicText,
          course: course || "",
          name: name || topicText,
        });
        const id = data?.id ?? null;
        setSessionId(id ? Number(id) : null);
        setTopic(topicText);
        setModalOpen(false);
        flash("Sesión creada");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleAddStudent = useCallback(
    async ({ id, name, program }) => {
      if (!sessionId) return setError("Crea una sesión primero");
      if (students.some((s) => String(s.id) === String(id)))
        return setError("Estudiante ya agregado");
      setLoading(true);
      setError(null);
      try {
        await addStudent(sessionId, { id, name, program });
        setStudents((prev) => [...prev, { id, name }]);
        flash("Estudiante agregado");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, students]
  );


  const handleFinish = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await finishSession(sessionId);
      flash("Sesión finalizada");
      setSessionId(null);
      setStudents([]);
      setTopic("");
      onSessionFinished?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId, onSessionFinished]);


  return (
    <div className={embedded ? styles.embedded : styles.container}>
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>
            {sessionId ? `Sesión ${sessionId}` : "No hay sesión activa"}
          </h2>
          <p className={styles.muted}>
            {topic ? `Tema: ${topic}` : "Crea una sesión para empezar"}
          </p>
          {user?.username && (
            <p className={styles.muted}>Monitor: {user.username}</p>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.btnNew} onClick={() => setModalOpen(true)}>
            Nueva sesión
          </button>
          {sessionId && <span className={styles.badge}>ID: {sessionId}</span>}
        </div>
      </div>

      {/* Modal crear sesión */}
      <SessionModal
        open={modalOpen}
        loading={loading}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />

      {/* Contenido */}
      <div className={styles.grid}>
        <section className={styles.card}>
          <StudentForm
            students={students}
            loading={loading}
            onAdd={handleAddStudent}
          />

          <Feedback type="error" message={error} />
          <Feedback type="success" message={success} />
        </section>

        <aside className={styles.card}>
          <h3>Información</h3>
          <p className={styles.muted}>
            Crea una sesión, añade estudiantes y finaliza cuando termines.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.btnFinish}
              onClick={handleFinish}
              disabled={loading || !sessionId}
            >
              Finalizar sesión
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
