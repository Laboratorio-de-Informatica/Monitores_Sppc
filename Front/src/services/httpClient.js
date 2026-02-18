const RAW_BASE = import.meta.env.VITE_API_URL;
const BASE_URL =
  RAW_BASE === undefined || RAW_BASE === ""
    ? ""
    : RAW_BASE.replace(/\/+$/, "");

function authHeaders(extra = {}) {
  const headers = new Headers(extra);
  const token = localStorage.getItem("token");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function parseBody(res) {
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

async function request(path, options = {}) {
  const url = BASE_URL ? `${BASE_URL}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const body = await parseBody(res).catch(() => null);
    const msg = body?.message ?? res.statusText ?? "Error desconocido";
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return parseBody(res);
}


export function get(path) {
  return request(path, { method: "GET" });
}

export function postJson(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function putJson(path, body) {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function putText(path, text) {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });
}

export function postForm(path, formData) {
  return request(path, {
    method: "POST",
    body: formData,
  });
}

export function del(path) {
  return request(path, { method: "DELETE" });
}
