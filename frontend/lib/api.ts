const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  token?: string
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Resume API
export const resumeApi = {
  getAll: (token: string) =>
    apiRequest("/api/resumes", { method: "GET" }, token),
  getById: (id: string, token: string) =>
    apiRequest(`/api/resumes/${id}`, { method: "GET" }, token),
  create: (data: any, token: string) =>
    apiRequest(
      "/api/resumes",
      { method: "POST", body: JSON.stringify(data) },
      token
    ),
  update: (id: string, data: any, token: string) =>
    apiRequest(
      `/api/resumes/${id}`,
      { method: "PUT", body: JSON.stringify(data) },
      token
    ),
  delete: (id: string, token: string) =>
    apiRequest(`/api/resumes/${id}`, { method: "DELETE" }, token),
  uploadPdf: (
    formData: FormData,
    token: string,
    template?: string,
    primaryColor?: string
  ) => {
    if (template) formData.append("template", template);
    if (primaryColor) formData.append("primaryColor", primaryColor);
    return fetch(`${API_URL}/api/resumes/upload-pdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to upload and parse PDF");
      return res.json();
    });
  },
  download: (id: string, token: string) => {
    return fetch(`${API_URL}/api/resumes/${id}/download`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to download resume");
      return res.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume-${id}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    });
  },
};

// AI API - Only for PDF parsing
export const aiApi = {
  parseResume: (formData: FormData, token: string) => {
    return fetch(`${API_URL}/api/ai/parse-resume`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to parse resume");
      return res.json();
    });
  },
};

export const pdfApi = {
  parse: (formData: FormData, token: string) => {
    return fetch(`${API_URL}/api/resumes/v1/pdf/parse`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to parse PDF");
      return res.json();
    });
  },
};
