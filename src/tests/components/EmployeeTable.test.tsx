import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { addDays, format } from 'date-fns';
import EmployeeTable from '../../components/directory/EmployeeTable';
import { Employee } from '../../types/employee';

const isoDate = (date: Date) => format(date, 'yyyy-MM-dd');

const makeEmployee = (overrides: Partial<Employee>): Employee => ({
  id: 'test-id',
  name: 'Test User',
  email: 'test@example.com',
  department: 'Engineering',
  role: 'Engineer',
  manager: 'Manager',
  status: 'active',
  employeeType: 'full-time',
  joinDate: '2024-01-15',
  probationEndDate: null,
  location: 'London',
  avatarInitials: 'TU',
  ...overrides,
});

describe('EmployeeTable', () => {
  it('renders employee name and email', () => {
    const employees = [makeEmployee({ name: 'Alice Chen', email: 'alice@example.com' })];
    render(<EmployeeTable employees={employees} />);
    expect(screen.getByText('Alice Chen')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('renders status badge for each employee', () => {
    const employees = [
      makeEmployee({ id: '1', name: 'Alice', status: 'active' }),
      makeEmployee({ id: '2', name: 'Bob', status: 'probation' }),
    ];
    render(<EmployeeTable employees={employees} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Probation')).toBeInTheDocument();
  });

  it('renders location and manager columns', () => {
    const employees = [
      makeEmployee({ location: 'Tokyo', manager: 'Dev Patel' }),
    ];
    render(<EmployeeTable employees={employees} />);
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('Dev Patel')).toBeInTheDocument();
  });

  it('renders empty table body when no employees provided', () => {
    render(<EmployeeTable employees={[]} />);
    const rows = document.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  it('shows a probation alert badge for employees whose review is due soon', () => {
    const employees = [
      makeEmployee({
        id: '1',
        name: 'Aisha',
        status: 'probation',
        probationEndDate: isoDate(addDays(new Date(), 10)),
      }),
    ];
    render(<EmployeeTable employees={employees} />);
    expect(screen.getByText('Review Due')).toBeInTheDocument();
  });
});
