import { get, postJson, postForm } from "./httpClient";

const PREFIX = "/api/v1/monitors";

/** Lista todos los monitores. */
export function getMonitors() {
  return get(PREFIX);
}

/** Crea un monitor manualmente (solo ADMIN). */
export function createMonitor(monitorData) {
  return postJson(PREFIX, monitorData);
}

/**
 * Carga masiva de monitores por Excel (solo ADMIN).
 * @param {File} file        — archivo .xlsx
 * @param {boolean} overwrite — si debe sobre-escribir existentes
 */
export function uploadMonitors(file, overwrite = false) {
  const form = new FormData();
  form.append("file", file);
  form.append("overwrite", overwrite);
  return postForm(`${PREFIX}/upload`, form);
}
