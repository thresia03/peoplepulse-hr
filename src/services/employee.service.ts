import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Employee, EmploymentStatus, DirectoryFilter, ProbationAlertStatus } from '../types/employee';

const PROBATION_ALERT_THRESHOLD_DAYS = 30;

export function getEmployees(employees: Employee[]): Employee[] {
  return [...employees].sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByStatus(
  employees: Employee[],
  status: EmploymentStatus | 'all',
): Employee[] {
  if (status === 'all') return employees;
  return employees.filter((e) => e.status === status);
}

export function searchEmployees(employees: Employee[], query: string): Employee[] {
  const q = query.toLowerCase().trim();
  if (!q) return employees;
  return employees.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q),
  );
}

export function applyFilter(employees: Employee[], filter: DirectoryFilter): Employee[] {
  const byStatus = filterByStatus(employees, filter.status);
  return searchEmployees(byStatus, filter.search);
}

export function getProbationAlertStatus(
  employee: Employee,
  referenceDate: Date,
  thresholdDays: number = PROBATION_ALERT_THRESHOLD_DAYS,
): ProbationAlertStatus | null {
  if (employee.status !== 'probation' || !employee.probationEndDate) return null;

  const daysRemaining = differenceInCalendarDays(
    parseISO(employee.probationEndDate),
    referenceDate,
  );

  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= thresholdDays) return 'review-due';
  return null;
}
