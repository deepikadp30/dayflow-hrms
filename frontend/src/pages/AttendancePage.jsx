import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../api/attendanceApi';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Calendar, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Filter, 
  RefreshCw,
  UserCheck,
  Building,
  Shield
} from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  // Today's state
  const [todayStatus, setTodayStatus] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [todayError, setTodayError] = useState('');

  // Attendance history logs state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logError, setLogError] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch today's status
  const fetchTodayStatus = async () => {
    setLoadingToday(true);
    setTodayError('');
    try {
      const status = await attendanceApi.getTodayStatus();
      setTodayStatus(status);
    } catch (err) {
      console.error('Failed to fetch today status:', err);
      setTodayError('Failed to load today check-in status.');
    } finally {
      setLoadingToday(false);
    }
  };

  // Fetch attendance history
  const fetchAttendanceLogs = async () => {
    setLoadingLogs(true);
    setLogError('');
    try {
      const data = await attendanceApi.getAttendance({
        date: dateFilter,
        status: statusFilter,
      });
      const list = Array.isArray(data) ? data : (data.results || []);
      setLogs(list);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setLogError(err.message || 'Failed to load attendance logs.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
    fetchAttendanceLogs();
  }, [dateFilter, statusFilter]);

  // Handle Check In
  const handleCheckIn = async () => {
    setActionLoading(true);
    setTodayError('');
    try {
      await attendanceApi.checkIn();
      await fetchTodayStatus();
      await fetchAttendanceLogs();
    } catch (err) {
      setTodayError(err.message || 'Check-in failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Check Out
  const handleCheckOut = async () => {
    setActionLoading(true);
    setTodayError('');
    try {
      await attendanceApi.checkOut();
      await fetchTodayStatus();
      await fetchAttendanceLogs();
    } catch (err) {
      setTodayError(err.message || 'Check-out failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const isCheckedIn = todayStatus?.checked_in;
  const isCheckedOut = todayStatus?.checked_out;
  const todayRecord = todayStatus?.record;

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Attendance & Work Logs</h1>
            <p className="text-xs text-slate-400 mt-1">
              Daily time tracking, check-in timestamps, and attendance history
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span className="font-semibold text-slate-200">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Today's Check-In / Check-Out Widget */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5 text-brand-400" />
            <h2 className="text-sm font-bold text-white">Today's Attendance Status</h2>
          </div>

          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
            isCheckedOut
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              : isCheckedIn
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCheckedOut ? 'Completed Day' : isCheckedIn ? 'Working / Checked In' : 'Not Checked In'}</span>
          </span>
        </div>

        {todayError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{todayError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
          {/* Action Trigger Buttons */}
          <div className="space-y-3">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading || loadingToday}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>Check In Now</span>
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading || loadingToday || isCheckedOut}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  isCheckedOut
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span>{isCheckedOut ? 'Checked Out for Today' : 'Check Out Now'}</span>
              </button>
            )}
          </div>

          {/* Today Stats Summary */}
          <div className="md:col-span-2 grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">Check In</span>
              <p className="text-base font-bold text-emerald-400 mt-1">
                {formatTime(todayRecord?.check_in)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">Check Out</span>
              <p className="text-base font-bold text-indigo-400 mt-1">
                {formatTime(todayRecord?.check_out)}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500">Work Duration</span>
              <p className="text-base font-bold text-brand-400 mt-1">
                {todayRecord?.formatted_duration || '0h 0m'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Logs Table */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-brand-400" />
            <span>Attendance Log History ({isAdmin ? 'All Records' : 'My Records'})</span>
          </h2>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="HALF_DAY">Half Day</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
            </select>

            {(dateFilter || statusFilter) && (
              <button
                onClick={() => { setDateFilter(''); setStatusFilter(''); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Reset filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {loadingLogs ? (
          <div className="p-8 text-center flex flex-col items-center space-y-2">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading attendance history...</p>
          </div>
        ) : logError ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {logError}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800">
            No attendance records found for selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  {isAdmin && <th className="p-3">Employee</th>}
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Work Duration</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-white">{log.date}</td>
                    {isAdmin && (
                      <td className="p-3">
                        <span className="font-semibold text-slate-200">{log.employee_name}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">ID: {log.employee_id || log.user_id}</span>
                      </td>
                    )}
                    <td className="p-3 font-mono text-emerald-400">{formatTime(log.check_in)}</td>
                    <td className="p-3 font-mono text-indigo-400">{formatTime(log.check_out)}</td>
                    <td className="p-3 font-semibold text-brand-400">{log.formatted_duration}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'PRESENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 'LATE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.status_display || log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
