import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Edit3, Mail, Phone, Building, Briefcase } from 'lucide-react';
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

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalHeadcount = employees.length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const totalPayroll = employees.reduce((s, e) => s + (e.salary || 0), 0);

  const handleExport = () => {
    exportToCSV('NexusFlow_Team_Directory', filteredEmployees);
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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <UserCheck className="w-3 h-3 text-[#2DD4BF]" />
            <span>Human Resources & Workforce</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Team Directory
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Departmental headcount, organizational roles, payroll allocations and status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Annual Payroll Allocation: <strong className="text-white tabular-nums">{formatCurrency(totalPayroll)}</strong>
          </span>
        </div>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Total Headcount</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {totalHeadcount} Staff
          </div>
          <span className="text-[11px] text-[#2DD4BF] font-mono mt-0.5 block">{activeCount} active today</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Engineering</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#818CF8] mt-1 tabular-nums">
            {employees.filter(e => e.department === 'Engineering').length} Members
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Core architecture</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Product & Design</span>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tabular-nums">
            {employees.filter(e => e.department === 'Product').length} Members
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">UX & Roadmap</span>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-white/[0.08] shadow-card-subtle">
          <span className="text-[10px] font-mono uppercase text-[#94A3B8]">Revenue & Sales</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#2DD4BF] mt-1 tabular-nums">
            {employees.filter(e => e.department === 'Sales').length} Reps
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Pipeline quota owners</span>
        </div>
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search employee name, role or email..."
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
        addLabel="Add Member"
      />

      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Employee</th>
                <th className="p-4">Role & Department</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Salary Base</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#94A3B8]">
                    No team members found matching search filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#151F32] border border-white/10 text-[#818CF8] flex items-center justify-center font-bold text-xs shadow-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                            {emp.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#94A3B8]">{emp.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-white">{emp.role}</div>
                      <span className="text-[11px] font-mono text-[#94A3B8]">{emp.department}</span>
                    </td>

                    <td className="p-4 text-[#94A3B8]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{emp.email}</span>
                        </div>
                        {emp.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white tabular-nums">
                      {emp.salary ? formatCurrency(emp.salary) : '—'}
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(emp.joinedDate)}
                    </td>

                    <td className="p-4">
                      <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'danger'} dot>
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 transition"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
