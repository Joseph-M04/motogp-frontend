const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:3001").replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

