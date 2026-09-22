import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { addDays, subDays, format } from 'date-fns';
import ProbationAlertBadge from '../../components/directory/ProbationAlertBadge';
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

describe('ProbationAlertBadge', () => {
  it('renders "Review Due" when probation ends within 30 days', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(addDays(new Date(), 10)),
    });
    render(<ProbationAlertBadge employee={employee} />);
    expect(screen.getByText('Review Due')).toBeInTheDocument();
  });

  it('renders "Review Overdue" when probationEndDate has already passed', () => {
    const employee = makeEmployee({
      status: 'probation',
      probationEndDate: isoDate(subDays(new Date(), 5)),
    });
    render(<ProbationAlertBadge employee={employee} />);
    expect(screen.getByText('Review Overdue')).toBeInTheDocument();
  });

  it('renders nothing when probationEndDate is null', () => {
    const employee = makeEmployee({ status: 'probation', probationEndDate: null });
    const { container } = render(<ProbationAlertBadge employee={employee} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when status is not "probation" even with a qualifying date', () => {
    const employee = makeEmployee({
      status: 'active',
      probationEndDate: isoDate(addDays(new Date(), 5)),
    });
    const { container } = render(<ProbationAlertBadge employee={employee} />);
    expect(container).toBeEmptyDOMElement();
  });
});
