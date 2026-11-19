import React, { useState } from 'react';
import { Calendar, Clock, Filter, Download, UserCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AttendanceCard } from '../components/hr/AttendanceCard';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { useData } from '../context/DataContext';
import { formatDate, exportToCSV } from '../lib/utils';

export const AttendancePage: React.FC = () => {
  const { attendance } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = a.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCSV('NexusFlow_Daily_Attendance_Logs', filteredAttendance);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Attendance & Shift Time Tracking</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time punch timestamps, biometric log validation & employee working hours.
          </p>
        </div>
      </div>

      {/* Live Punch Terminal */}
      <AttendanceCard />

      {/* Toolbar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff member attendance..."
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Present', value: 'Present' },
          { label: 'Late', value: 'Late' },
          { label: 'Half Day', value: 'Half Day' },
          { label: 'On Leave', value: 'On Leave' },
        ]}
        onExport={handleExport}
      />

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Log Date</th>
                <th className="p-4">Punch In</th>
                <th className="p-4">Punch Out</th>
                <th className="p-4">Hours Logged</th>
                <th className="p-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No attendance records found for criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      <div>{rec.employeeName}</div>
                      <div className="text-xs font-normal text-slate-400">{rec.employeeId}</div>
                    </td>

                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300">
                      {formatDate(rec.date)}
                    </td>

                    <td className="p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {rec.checkIn || '--:--'}
                    </td>

                    <td className="p-4 text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {rec.checkOut || (rec.checkIn ? 'In Progress' : '--:--')}
                    </td>

                    <td className="p-4 text-xs font-bold text-slate-900 dark:text-white">
                      {rec.hoursWorked > 0 ? `${rec.hoursWorked} hrs` : '--'}
                    </td>

                    <td className="p-4">
                      <Badge variant={rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'danger'}>
                        {rec.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
