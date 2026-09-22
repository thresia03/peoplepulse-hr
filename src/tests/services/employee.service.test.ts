import { describe, it, expect } from 'vitest';
import { addDays, subDays, format } from 'date-fns';
import {
  getEmployees,
  filterByStatus,
  searchEmployees,
  applyFilter,
  getProbationAlertStatus,
} from '../../services/employee.service';
import { Employee } from '../../types/employee';

const makeEmployee = (overrides: Partial<Employee>): Employee => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  department: 'Engineering',
  role: 'Engineer',
  manager: 'Manager',
  status: 'active',
  employeeType: 'full-time',
  joinDate: '2023-01-01',
  probationEndDate: null,
  location: 'London',
  avatarInitials: 'TU',
  ...overrides,
});

const employees: Employee[] = [
  makeEmployee({ id: '1', name: 'Alice Chen', status: 'active' }),
  makeEmployee({ id: '2', name: 'Bob Smith', status: 'probation' }),
  makeEmployee({ id: '3', name: 'Carol Davies', status: 'on-leave', department: 'Product' }),
  makeEmployee({ id: '4', name: 'Dan Wilson', status: 'notice-period', role: 'Designer' }),
];

describe('getEmployees', () => {
  it('returns employees sorted alphabetically by name', () => {
    const shuffled = [employees[2], employees[0], employees[3], employees[1]];
    const result = getEmployees(shuffled);
    expect(result.map((e) => e.name)).toEqual([
      'Alice Chen',
      'Bob Smith',
      'Carol Davies',
      'Dan Wilson',
    ]);
  });

  it('returns empty array when given empty input', () => {
    expect(getEmployees([])).toEqual([]);
  });
});

describe('filterByStatus', () => {
  it('returns all employees when status is "all"', () => {
    expect(filterByStatus(employees, 'all')).toHaveLength(4);
  });

  it('filters to only employees with matching status', () => {
    const result = filterByStatus(employees, 'probation');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Bob Smith');
  });

  it('returns empty array when no employees match', () => {
    expect(filterByStatus(employees, 'notice-period')).toHaveLength(1);
    expect(filterByStatus(employees.slice(0, 3), 'notice-period')).toHaveLength(0);
  });
});

describe('searchEmployees', () => {
  it('returns all employees for empty query', () => {
    expect(searchEmployees(employees, '')).toHaveLength(4);
  });

  it('matches on name (case-insensitive)', () => {
    const result = searchEmployees(employees, 'alice');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Chen');
  });

  it('matches on department', () => {
    const result = searchEmployees(employees, 'product');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Carol Davies');
  });

  it('matches on role', () => {
    const result = searchEmployees(employees, 'designer');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Dan Wilson');
  });

  it('returns empty array when nothing matches', () => {
    expect(searchEmployees(employees, 'zzzznotfound')).toHaveLength(0);
  });
});

describe('applyFilter', () => {
  it('applies both status and search filters together', () => {
    const result = applyFilter(employees, { status: 'active', search: 'alice' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice Chen');
  });

  it('returns empty array when filters exclude all results', () => {
    const result = applyFilter(employees, { status: 'probation', search: 'alice' });
    expect(result).toHaveLength(0);
  });
});

describe('getProbationAlertStatus', () => {
  const REFERENCE_DATE = new Date('2024-06-15T00:00:00.000Z');
  const isoDate = (date: Date) => format(date, 'yyyy-MM-dd');

  it('returns "review-due" when probation ends within the threshold', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(addDays(REFERENCE_DATE, 10)),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBe('review-due');
  });

  it('returns "overdue" when probationEndDate has already passed', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(subDays(REFERENCE_DATE, 5)),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBe('overdue');
  });

  it('returns null when probation ends more than the threshold away', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(addDays(REFERENCE_DATE, 31)),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBeNull();
  });

  it('treats the 30-day threshold boundary as inclusive', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(addDays(REFERENCE_DATE, 30)),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBe('review-due');
  });

  it('treats a probationEndDate of today as "review-due", not "overdue"', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(REFERENCE_DATE),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBe('review-due');
  });

  it('returns null when probationEndDate is null', () => {
    const employee = makeEmployee({ status: 'probation', probationEndDate: null });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBeNull();
  });

  it('returns null when status is not "probation" even if probationEndDate qualifies', () => {
    const employee = makeEmployee({
      status: 'active',
      probationEndDate: isoDate(addDays(REFERENCE_DATE, 5)),
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBeNull();
  });

  it('returns null when probationEndDate is not a parseable date', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: 'not-a-date',
    });
    expect(getProbationAlertStatus(employee, REFERENCE_DATE)).toBeNull();
  });
});
