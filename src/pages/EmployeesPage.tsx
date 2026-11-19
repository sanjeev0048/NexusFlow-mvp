import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Edit3, Mail, Phone, Briefcase, DollarSign } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { EmployeeModal } from '../components/hr/EmployeeModal';
import { Employee } from '../types';
import { useData } from '../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../lib/utils';

export const EmployeesPage: React.FC = () => {
  const { employees, deleteEmployee } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || e.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleExport = () => {
    exportToCSV('NexusFlow_Employees', filteredEmployees);
  };

  const handleEdit = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <span>Employee & Staff Directory</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Internal organization roster, departmental roles, and compensation records.
          </p>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff name, role or email..."
        statusFilter={departmentFilter}
        onStatusFilterChange={setDepartmentFilter}
        statusOptions={[
          { label: 'All Departments', value: 'All' },
          { label: 'Engineering', value: 'Engineering' },
          { label: 'Product', value: 'Product' },
          { label: 'Sales', value: 'Sales' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Finance', value: 'Finance' },
          { label: 'HR', value: 'HR' },
          { label: 'Operations', value: 'Operations' },
        ]}
        onExport={handleExport}
        onAddClick={handleNew}
        addLabel="Onboard Employee"
      />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Employee</th>
                <th className="p-4">Title & Department</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No employees matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{emp.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{emp.role}</div>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{emp.department}</span>
                    </td>

                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {emp.salary ? formatCurrency(emp.salary) : 'Confidential'}
                    </td>

                    <td className="p-4">
                      <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'danger'}>
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {formatDate(emp.joinedDate)}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          title="Remove Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeToEdit={employeeToEdit}
      />
    </div>
  );
};
