import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogIn, LogOut, Calendar, ShieldCheck, Activity } from 'lucide-react';
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
    <Card className="p-6 bg-[#101827] border-white/[0.08] shadow-card-elevated" elevated glowTop>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
            <Clock className="w-4 h-4 text-[#818CF8]" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">Live Shift Attendance Console</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
            {currentTime}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 font-mono">
            Authenticated as <strong className="text-white">{user?.name}</strong> ({user?.role}) • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Status Metrics */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#151F32] border border-white/[0.08]">
              <span className="text-[#94A3B8] block text-[10px] uppercase">Punch In</span>
              <span className="font-bold text-white tabular-nums">
                {currentAttendance?.checkIn || '--:--'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#151F32] border border-white/[0.08]">
              <span className="text-[#94A3B8] block text-[10px] uppercase">Punch Out</span>
              <span className="font-bold text-white tabular-nums">
                {currentAttendance?.checkOut || '--:--'}
              </span>
            </div>
          </div>

          {/* Punch Button */}
          {!isCheckedOut ? (
            <button
              onClick={toggleCheckIn}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95 ${
                isCheckedIn 
                  ? 'bg-amber-500 hover:bg-amber-400 text-[#080B14] shadow-glow-accent' 
                  : 'bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#080B14] shadow-glow-accent'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Clock Out Shift</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Clock In Now</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 rounded-xl text-xs font-bold text-[#2DD4BF] font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Shift Logged ({currentAttendance.hoursWorked} hrs)</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
