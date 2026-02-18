export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}

export function getUserFromToken(token) {
  const payload = decodeToken(token);
  if (!payload) return null;
  return {
    email: payload.sub ?? "",
    username: payload.username ?? payload.sub ?? "",
    role: payload.role ?? "MONITOR",
  };
}
