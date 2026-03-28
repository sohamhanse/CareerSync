import type { ApiResponse, AuthUser, UserProfile, SearchParams, SearchResults, Job } from "./api.types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "auth_token";

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

const request = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const json: ApiResponse<T> = await res.json();

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/auth";
    throw new Error("Session expired");
  }

  if (!res.ok && !json.success) {
    throw new Error(json.message || "Request failed");
  }

  return json;
};

// ── Auth ───────────────────────────────────────────────
export const register = (email: string, password: string) =>
  request<{ token: string; user: AuthUser }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const login = (email: string, password: string) =>
  request<{ token: string; user: AuthUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMe = () =>
  request<{ user: AuthUser & { profile: UserProfile } }>("/api/auth/me");

// ── Profile ────────────────────────────────────────────
export const getProfile = () =>
  request<{ profile: UserProfile; profile_complete: boolean }>("/api/profile");

export const updateProfile = (data: Partial<UserProfile>) =>
  request<{ profile: UserProfile; profile_complete: boolean }>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ── Jobs ───────────────────────────────────────────────
export const searchJobs = async (params: SearchParams) => {
  const res = await request<SearchResults>("/api/jobs/search", {
    method: "POST",
    body: JSON.stringify(params),
  });
  // Keep existing behaviour: store in localStorage for JobDetail page
  if (res.success) {
    localStorage.setItem("searchResults", JSON.stringify({ success: true, data: res.data }));
  }
  return res;
};

export const getRecommendedJobs = () =>
  request<{ jobs: Job[]; results_count: number; needs_profile: boolean }>("/api/jobs/recommended");

// ── Saved Jobs ─────────────────────────────────────────
export const getSavedJobs = () =>
  request<{ saved_jobs: unknown[] }>("/api/saved");

export const toggleSavedJob = (jobId: string, action: "save" | "unsave", jobData?: unknown) => {
  if (action === "save") {
    return request(`/api/saved/${jobId}`, {
      method: "POST",
      body: JSON.stringify({ job_data: jobData }),
    });
  }
  return request(`/api/saved/${jobId}`, { method: "DELETE" });
};

export const checkJobSaved = async (jobId: string): Promise<boolean> => {
  const res = await request<{ is_saved: boolean }>(`/api/saved/check/${jobId}`);
  return res.data.is_saved;
};

// ── Applications ───────────────────────────────────────
export const getApplications = () =>
  request<{ applications: unknown[] }>("/api/applications");

export const submitApplication = (data: { job_id: string; job_data: unknown; notes?: string }) =>
  request("/api/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateApplicationStatus = (id: string, status: string) =>
  request(`/api/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ── Notifications (stubs — wire to DB later) ──────────
export const getNotifications = async () => ({ data: { notifications: [], unreadCount: 0 } });
export const markNotificationAsRead = async (_id: string) => ({});
export const markAllNotificationsAsRead = async () => ({});
