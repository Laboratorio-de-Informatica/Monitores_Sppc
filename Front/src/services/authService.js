import { postJson } from "./httpClient";

const PREFIX = "/api/v1/auth";

/**
 * Inicia sesión y devuelve { token }.
 */
export function login(email, password) {
  return postJson(`${PREFIX}/login`, {
    email,
    password,
    loginTime: new Date().toISOString(),
  });
}
