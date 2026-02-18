import { get, postJson, putJson, del } from "./httpClient";

const PREFIX = "/api/v1/logbooks";

/**
 * Crea un nuevo logbook (sesión de monitoria).
 * El backend resuelve el monitorId desde el JWT si no se envía.
 */
export function createSession({ topic, course, name }) {
  return postJson(PREFIX, {
    topic: topic?.trim() ?? "",
    course: course?.trim() ?? "",
    name: name?.trim() ?? "",
    startTime: new Date().toISOString(),
    students: [],
  });
}

/** Agrega un estudiante a un logbook existente. */
export function addStudent(logbookId, { id, name, program }) {
  return postJson(`${PREFIX}/${Number(logbookId)}/students`, {
    id: Number(id),
    name: name ?? "",
    program: program ?? "",
  });
}

/** Finaliza la sesión (pone endTime = ahora). */
export function finishSession(logbookId) {
  return putJson(`${PREFIX}/${Number(logbookId)}/finish`, {});
}

/** Obtiene un logbook por ID. */
export function getSession(logbookId) {
  return get(`${PREFIX}/${Number(logbookId)}`);
}

/** Elimina un logbook. */
export function deleteSession(logbookId) {
  return del(`${PREFIX}/${Number(logbookId)}`);
}
