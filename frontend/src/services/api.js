const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Get headers (no authentication needed)
function getHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

// No authentication needed - removed all auth functions

// Quiz API calls (no authentication required)
export async function generateQuiz(url) {
  const res = await fetch(`${BASE_URL}/generate_quiz`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Quiz generation failed");
  }
  return await res.json();
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch history");
  }
  return await res.json();
}

export async function getQuiz(id) {
  const res = await fetch(`${BASE_URL}/quiz/${id}`, {
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to fetch quiz");
  }
  return await res.json();
}

export async function previewUrl(url) {
  const res = await fetch(`${BASE_URL}/url/preview`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to preview URL");
  }
  return await res.json();
}
