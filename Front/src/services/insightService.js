import {
  getAverageDuration,
  getSessionsPerWeek,
  getTopMonitor,
  getStudentsPerSession,
} from "./statisticService";

/**
 * Trae los 4 KPIs y los devuelve en el formato que espera InsightsOverview.
 * Si algún endpoint falla, devuelve valores por defecto en vez de lanzar.
 */
export async function getInsightsOverview() {
  const safe = (promise, fallback) => promise.catch(() => fallback);

  const [avgDuration, sessionsWeek, topMonitor, studentsBySession] =
    await Promise.all([
      safe(getAverageDuration(), 0),
      safe(getSessionsPerWeek(), {}),
      safe(getTopMonitor(), { monitorName: "-", sessions: 0 }),
      safe(getStudentsPerSession(), []),
    ]);

  // Sesiones esta semana: la última entrada del mapa
  const weekValues = Object.values(sessionsWeek ?? {});
  const sessionsThisWeek = weekValues.length > 0 ? weekValues[weekValues.length - 1] : 0;

  // Promedio de estudiantes por sesión
  const list = Array.isArray(studentsBySession) ? studentsBySession : [];
  const counts = list.map((s) => (s.students?.length ?? 0));
  const avgStudents = counts.length > 0
    ? counts.reduce((a, b) => a + b, 0) / counts.length
    : 0;

  return {
    avgSessionDurationMinutes: avgDuration ?? 0,
    sessionsThisWeek,
    topMonitorName: topMonitor?.monitorName ?? "-",
    topMonitorSessions: topMonitor?.sessions ?? 0,
    avgStudentsPerSession: avgStudents,
  };
}

/**
 * Devuelve las sesiones por semana (para el gráfico de barras).
 */
export async function getInsightsTopics() {
  try {
    return await getSessionsPerWeek();
  } catch {
    return {};
  }
}
