export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  id: string;
  email: string;
  profile_complete: boolean;
}

export interface UserProfile {
  full_name: string;
  phone: string;
  location: string;
  about: string;
  experience_years: number;
  current_role: string;
  experience: any[];
  desired_roles: string[];
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  education: string;
  preferred_locations: string[];
  remote_preference: "remote" | "hybrid" | "onsite" | "any";
  salary_min: number;
  salary_max: number;
  industry: string;
  job_type: "fulltime" | "parttime" | "contract" | "internship" | "any";
}

// ── Resume Analysis (ML Backend) ──────────────────────────
export interface AIJob {
  role: string;
  company: string;
  description: string;
  experience: string;
  location: string;
  salary?: string;
  apply_link: string;
  posted_at?: string;
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
}

export interface RecommendationResponse {
  success: boolean;
  jobs: AIJob[];
  total_analyzed: number;
  candidate_domain: string;
  candidate_skills_count: number;
  parse_source: string;
  error?: string;
}
