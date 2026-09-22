import Badge from '../ui/Badge';
import { Employee, ProbationAlertStatus } from '../../types/employee';
import { getProbationAlertStatus } from '../../services/employee.service';

const labels: Record<ProbationAlertStatus, string> = {
  'review-due': 'Review Due',
  overdue: 'Review Overdue',
};

interface ProbationAlertBadgeProps {
  employee: Employee;
}

export default function ProbationAlertBadge({ employee }: ProbationAlertBadgeProps) {
  const alertStatus = getProbationAlertStatus(employee, new Date());
  if (!alertStatus) return null;
  return <Badge variant="danger">{labels[alertStatus]}</Badge>;
}
