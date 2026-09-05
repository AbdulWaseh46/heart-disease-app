const API_BASE = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  enable2FA: (body) => request("/auth/enable-2fa", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  verify2FA: (body) => request("/auth/verify-2fa", { method: "POST", body: JSON.stringify(body) }),
  predict: (body, token) =>
    request("/predict", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}` },
    }),
  modelInfo: () => request("/model-info"),
};

export function saveSession(token, name) {
  localStorage.setItem("heartcheck_token", token);
  localStorage.setItem("heartcheck_name", name || "");
}

export function getSession() {
  return {
    token: localStorage.getItem("heartcheck_token"),
    name: localStorage.getItem("heartcheck_name"),
  };
}

export function clearSession() {
  localStorage.removeItem("heartcheck_token");
  localStorage.removeItem("heartcheck_name");
}
