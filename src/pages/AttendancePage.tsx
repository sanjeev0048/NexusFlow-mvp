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

  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : '100';

  const handleExport = () => {
    exportToCSV('NexusFlow_Daily_Attendance_Logs', filteredAttendance);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#818CF8]/10 text-[#818CF8] text-[11px] font-mono border border-[#818CF8]/25 mb-1.5">
            <Clock className="w-3 h-3 text-[#2DD4BF]" />
            <span>Shift & Timestamp Audit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Attendance Punch Logs
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            Real-time shift punch timestamps, working hours audit & employee status verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
          <span className="px-3 py-1.5 rounded-xl bg-[#101827] border border-white/[0.08]">
            Today's Attendance Rate: <strong className="text-[#2DD4BF] tabular-nums">{attendanceRate}%</strong>
          </span>
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
      <Card className="overflow-hidden border-white/[0.08]" elevated>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151F32]/80 border-b border-white/[0.08] text-[11px] uppercase font-mono tracking-wider text-[#94A3B8]">
                <th className="p-4">Staff Member</th>
                <th className="p-4">Log Date</th>
                <th className="p-4">Punch In</th>
                <th className="p-4">Punch Out</th>
                <th className="p-4">Hours Logged</th>
                <th className="p-4">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#94A3B8]">
                    No attendance records found for criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-[#818CF8] transition text-sm">
                        {rec.employeeName}
                      </div>
                      <div className="text-[11px] font-mono text-[#94A3B8]">{rec.employeeId}</div>
                    </td>

                    <td className="p-4 text-[#94A3B8] font-mono text-[11px]">
                      {formatDate(rec.date)}
                    </td>

                    <td className="p-4 font-mono font-bold text-white tabular-nums">
                      {rec.checkIn || '—'}
                    </td>

                    <td className="p-4 font-mono font-bold text-white tabular-nums">
                      {rec.checkOut || '—'}
                    </td>

                    <td className="p-4 font-mono text-white tabular-nums">
                      {rec.hoursWorked > 0 ? `${rec.hoursWorked} hrs` : 'In Progress'}
                    </td>

                    <td className="p-4">
                      <Badge 
                        variant={
                          rec.status === 'Present' ? 'success' : 
                          rec.status === 'Late' ? 'warning' : 'default'
                        }
                        dot
                      >
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
