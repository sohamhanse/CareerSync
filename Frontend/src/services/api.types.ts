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

export interface Job {
  job_id: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  company_url?: string;
  location: string;
  remote_work?: string;
  job_level?: string;
  job_description?: string;
  date_posted: string;
  days_ago?: number;
  job_source: string;
  job_url: string;
  listing_type?: string;
  skills_required?: string[];
  salary_range?: { currency: string; min_amount: number; max_amount: number };
  experience_range?: { min_years: number; max_years: number };
  match_score?: number;
}

export interface SearchParams {
  search?: string;
  location?: string;
  site?: string;
  days_old?: number;
  results?: number;
  remote_only?: boolean;
}

export interface SearchResults {
  jobs: Job[];
  results_count: number;
  cached: boolean;
  query: SearchParams;
}
