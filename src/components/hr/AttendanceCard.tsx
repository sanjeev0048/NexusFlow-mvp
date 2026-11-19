import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogIn, LogOut, Calendar, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AttendanceCard: React.FC = () => {
  const { user } = useAuth();
  const { currentAttendance, toggleCheckIn } = useData();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCheckedIn = !!currentAttendance?.checkIn;
  const isCheckedOut = !!currentAttendance?.checkOut;

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 border-slate-200 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Attendance Punch Console</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {currentTime}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Logged in as <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong> • Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Status Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase">Punch In</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentAttendance?.checkIn || '--:--'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[10px] uppercase">Punch Out</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {currentAttendance?.checkOut || '--:--'}
              </span>
            </div>
          </div>

          {/* Punch Button */}
          {!isCheckedOut ? (
            <button
              onClick={toggleCheckIn}
              className={`px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 ${
                isCheckedIn 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Clock Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Clock In Now</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Shift Completed ({currentAttendance.hoursWorked} hrs)</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
