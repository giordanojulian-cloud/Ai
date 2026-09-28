/** Small JSON POST helper for client components. Returns a normalized result. */
export async function postJson<T = unknown>(
  url: string,
  body: unknown,
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    if (!response.ok) return { ok: false, status: response.status, error: data.error ?? "Something went wrong. Please try again." };
    return { ok: true, data };
  } catch {
    return { ok: false, status: 0, error: "Network error. Please check your connection and try again." };
  }
}
