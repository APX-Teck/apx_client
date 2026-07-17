export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export enum WorkMode {
  REMOTE = 'REMOTE',
  ONSITE = 'ONSITE',
  HYBRID = 'HYBRID',
}

export enum ExperienceLevel {
  FRESHER = 'FRESHER',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum ApplicationStatus {
  RECEIVED = 'RECEIVED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface JobListing {
  id: number;
  title: string;
  slug: string;
  department: string;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  location?: string;

  salaryMin?: number;
  salaryMax?: number;
  showSalary: boolean;

  description: string;
  requirements?: string;

  applicationDeadline?: string;
  vacancies: number;
  isActive: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: number;
  jobId: number;
  job?: JobListing;

  fullName: string;
  email: string;
  phone: string;
  currentCity?: string;
  linkedinUrl?: string;
  currentRole?: string;
  totalExperience?: string;
  noticePeriod?: string;
  skills: string[];
  education?: string;
  resumeUrl?: string;
  resumeFileId?: string;
  source?: string;

  status: ApplicationStatus;
  statusNote?: string;

  createdAt: string;
  updatedAt: string;
}
