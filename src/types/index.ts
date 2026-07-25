export type UserRole = "admin" | "employer" | "candidate";

export type JobType = "full_time" | "part_time" | "contract" | "internship" | "temporary";
export type JobStatus = "open" | "closed" | "draft";
export type ApplicationStatus = "applied" | "reviewed" | "interview" | "rejected" | "hired";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface Employer {
  id: number;
  company_name: string;
  company_website: string | null;
  description: string | null;
  created_at: string;
}

export interface Candidate {
  id: number;
  full_name: string;
  phone: string | null;
  headline: string | null;
  created_at: string;
}

export interface JobListing {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  location: string | null;
  remote: boolean;
  job_type: JobType;
  status: JobStatus;
  salary_min: number | null;
  salary_max: number | null;
  created_at: string;
  expires_at: string | null;
}

export interface Paginated<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

export interface Resume {
  id: number;
  candidate_id: number;
  filename: string;
  size_bytes: number;
  is_primary: boolean;
  uploaded_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  candidate_id: number;
  resume_id: number | null;
  cover_letter: string | null;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  total_applications: number;
  by_status: Record<ApplicationStatus, number>;
  total_jobs: number;
  open_jobs: number;
  total_employers: number;
  total_candidates: number;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export interface JobSearchFilters {
  q?: string;
  location?: string;
  job_type?: JobType;
  remote?: boolean;
  salary_min?: number;
  salary_max?: number;
  employer_id?: number;
  page?: number;
  page_size?: number;
}
