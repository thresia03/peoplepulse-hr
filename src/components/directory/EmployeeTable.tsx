import { Employee } from '../../types/employee';
import Table from '../ui/Table';
import StatusBadge from './StatusBadge';
import ProbationAlertBadge from './ProbationAlertBadge';

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table
      data={employees}
      keyExtractor={(e) => e.id}
      columns={[
        {
          key: 'name',
          header: 'Employee',
          render: (e) => (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {e.avatarInitials}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{e.name}</div>
                <div className="text-xs text-gray-500">{e.email}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'role',
          header: 'Role',
          render: (e) => (
            <div>
              <div className="text-sm text-gray-900">{e.role}</div>
              <div className="text-xs text-gray-500">{e.department}</div>
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (e) => (
            <div className="flex flex-col gap-1">
              <StatusBadge status={e.status} />
              <ProbationAlertBadge employee={e} />
            </div>
          ),
        },
        {
          key: 'location',
          header: 'Location',
          render: (e) => <span className="text-sm text-gray-600">{e.location}</span>,
        },
        {
          key: 'manager',
          header: 'Manager',
          render: (e) => <span className="text-sm text-gray-600">{e.manager}</span>,
        },
        {
          key: 'joinDate',
          header: 'Join Date',
          render: (e) => (
            <span className="text-sm text-gray-600">
              {new Date(e.joinDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          ),
        },
      ]}
    />
  );
}
