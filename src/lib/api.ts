export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

export type ApiError = Error & { status?: number; code?: string };

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const err: ApiError = new Error(
      (isJson ? (data.detail || data.error || data.message) : data) ||
        `Request failed with status ${res.status}`
    );
    err.status = res.status;
    if (isJson && data.detail && typeof data.detail === "string") {
      err.code = data.detail;
    } else if (isJson && typeof data.code === "string") {
      err.code = data.code;
    }
    throw err;
  }

  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return handleResponse<T>(res);
}
