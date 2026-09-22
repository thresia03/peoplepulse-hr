export type EmploymentStatus = 'active' | 'on-leave' | 'probation' | 'notice-period';
export type EmployeeType = 'full-time' | 'contractor' | 'intern';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  status: EmploymentStatus;
  employeeType: EmployeeType;
  joinDate: string; // ISO
  probationEndDate: string | null;
  location: string;
  avatarInitials: string;
}

export type DirectoryFilter = {
  status: EmploymentStatus | 'all';
  search: string;
};

export type ProbationAlertStatus = 'review-due' | 'overdue';
