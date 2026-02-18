import { get } from "./httpClient";

const PREFIX = "/api/v1/statistics";

export function getAverageDuration() {
  return get(`${PREFIX}/average-duration`);
}

export function getSessionsPerWeek() {
  return get(`${PREFIX}/sessions-per-week`);
}

export function getTopMonitor() {
  return get(`${PREFIX}/top-monitor`);
}

export function getStudentsPerSession() {
  return get(`${PREFIX}/students-per-session`);
}

/** Helper que trae los 4 KPIs de una vez. */
export async function getOverview() {
  const [avgDuration, sessionsWeek, topMonitor, studentsPerSession] =
    await Promise.all([
      getAverageDuration(),
      getSessionsPerWeek(),
      getTopMonitor(),
      getStudentsPerSession(),
    ]);

  return { avgDuration, sessionsWeek, topMonitor, studentsPerSession };
}
