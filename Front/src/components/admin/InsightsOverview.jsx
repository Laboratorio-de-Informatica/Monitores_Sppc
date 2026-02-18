import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getInsightsOverview, getInsightsTopics } from "../../services/insightService";
import styles from "./InsightsOverview.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InsightsOverview() {
  const [overview, setOverview] = useState(null);
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([getInsightsOverview(), getInsightsTopics()])
      .then(([ov, tp]) => {
        if (!mounted) return;
        setOverview(ov ?? null);
        setTopics(tp ?? {});
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Error al cargar insights");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const chartData = useMemo(() => {
    if (!topics) return null;
    const labels = Object.keys(topics);
    const values = labels.map((k) => Number(topics[k]) || 0);
    return {
      labels,
      datasets: [
        {
          label: "Sesiones por semana",
          data: values,
          backgroundColor: "rgba(17,153,142,0.75)",
          borderRadius: 4,
        },
      ],
    };
  }, [topics]);

  if (loading) return <div className={styles.loading}>Cargando insights…</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!overview) return <div className={styles.loading}>No hay datos disponibles.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Insights</h2>
      </div>

      <div className={styles.cards}>
        <div className={styles.kpiCard}>
          <h4>Duración media (min)</h4>
          <div className={styles.value}>
            {Number(overview.avgSessionDurationMinutes ?? 0).toFixed(1)}
          </div>
        </div>
        <div className={styles.kpiCard}>
          <h4>Sesiones esta semana</h4>
          <div className={styles.value}>{overview.sessionsThisWeek ?? 0}</div>
        </div>
        <div className={styles.kpiCard}>
          <h4>Monitor top</h4>
          <div className={styles.value}>{overview.topMonitorName ?? "-"}</div>
          <div className={styles.subvalue}>
            Sesiones: {overview.topMonitorSessions ?? 0}
          </div>
        </div>
        <div className={styles.kpiCard}>
          <h4>Prom. estudiantes / sesión</h4>
          <div className={styles.value}>
            {Number(overview.avgStudentsPerSession ?? 0).toFixed(1)}
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3>Sesiones por semana</h3>
        {chartData && chartData.labels.length > 0 ? (
          <Bar
            data={chartData}
            options={{ responsive: true, plugins: { legend: { position: "top" } } }}
          />
        ) : (
          <p>No hay datos de sesiones aún.</p>
        )}
      </div>
    </div>
  );
}
