import React, { useState, useEffect } from 'react';
import { leaveApi } from '../api/leaveApi';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarDays, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ban, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  User, 
  Building, 
  X, 
  Check, 
  Send
} from 'lucide-react';

export default function LeaveManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Apply Leave Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyFormData, setApplyFormData] = useState({
    leave_type: 'CASUAL',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [applyError, setApplyError] = useState('');

  // Admin Review Modal State
  const [reviewingLeave, setReviewingLeave] = useState(null); // leave object to approve/reject
  const [reviewAction, setReviewAction] = useState('APPROVE'); // 'APPROVE' or 'REJECT'
  const [adminNote, setAdminNote] = useState('');
  const [processingReview, setProcessingReview] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState(isAdmin ? 'PENDING' : '');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await leaveApi.getLeaves({
        status: statusFilter,
        leave_type: typeFilter,
      });
      const list = Array.isArray(data) ? data : (data.results || []);
      setLeaves(list);
    } catch (err) {
      console.error('Failed to fetch leave requests:', err);
      setError(err.message || 'Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, typeFilter]);

  const handleApplyChange = (e) => {
    setApplyFormData({ ...applyFormData, [e.target.name]: e.target.value });
    if (applyError) setApplyError('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyFormData.start_date || !applyFormData.end_date || !applyFormData.reason.trim()) {
      setApplyError('Please complete all required fields.');
      return;
    }
    if (new Date(applyFormData.start_date) > new Date(applyFormData.end_date)) {
      setApplyError('End date must be on or after start date.');
      return;
    }

    setSubmitting(true);
    setApplyError('');
    try {
      await leaveApi.createLeave(applyFormData);
      setShowApplyModal(false);
      setApplyFormData({ leave_type: 'CASUAL', start_date: '', end_date: '', reason: '' });
      await fetchLeaves();
    } catch (err) {
      setApplyError(err.message || 'Failed to submit leave request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (id) => {
    try {
      await leaveApi.cancelLeave(id);
      await fetchLeaves();
    } catch (err) {
      alert(err.message || 'Failed to cancel leave request.');
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewingLeave) return;
    setProcessingReview(true);
    try {
      if (reviewAction === 'APPROVE') {
        await leaveApi.approveLeave(reviewingLeave.id, adminNote);
      } else {
        await leaveApi.rejectLeave(reviewingLeave.id, adminNote);
      }
      setReviewingLeave(null);
      setAdminNote('');
      await fetchLeaves();
    } catch (err) {
      alert(err.message || 'Failed to process leave review.');
    } finally {
      setProcessingReview(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Leave Management</h1>
            <p className="text-xs text-slate-400 mt-1">
              Apply for leaves, track approval statuses, and manage time-off requests
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold">Filter Requests:</span>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Types</option>
            <option value="CASUAL">Casual Leave</option>
            <option value="SICK">Sick Leave</option>
            <option value="EARNED">Earned Leave</option>
            <option value="UNPAID">Unpaid Leave</option>
          </select>

          {(statusFilter || typeFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setTypeFilter(''); }}
              className="text-brand-400 font-semibold hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          Showing {leaves.length} request(s)
        </span>
      </div>

      {/* Leave Requests Table / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading leave requests from DRF backend...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 flex flex-col items-center space-y-3">
          <AlertCircle className="w-8 h-8" />
          <p className="text-xs font-medium">{error}</p>
          <button
            onClick={fetchLeaves}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      ) : leaves.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Leave Requests Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isAdmin ? 'No leave applications matching the active filters.' : 'You have not submitted any leave requests yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((leave) => {
            const isPending = leave.status === 'PENDING';
            const isOwner = leave.user_id === user?.id;

            return (
              <div
                key={leave.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-white">{leave.employee_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      ID: {leave.employee_id || leave.user_id}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {leave.leave_type_display || leave.leave_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-200">Duration:</strong> {leave.start_date} to {leave.end_date} ({leave.duration_days} day{leave.duration_days > 1 ? 's' : ''})
                  </p>

                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
                    "{leave.reason}"
                  </p>

                  {leave.admin_note && (
                    <p className="text-xs text-indigo-300">
                      <strong>Admin Note:</strong> {leave.admin_note} (Reviewed by {leave.reviewed_by_name || 'Admin'})
                    </p>
                  )}
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center space-x-3 justify-between md:justify-end">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                    leave.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : leave.status === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : leave.status === 'CANCELLED'
                      ? 'bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {leave.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {leave.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                    {leave.status === 'PENDING' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
                    {leave.status === 'CANCELLED' && <Ban className="w-3.5 h-3.5" />}
                    <span>{leave.status_display || leave.status}</span>
                  </span>

                  {/* Actions */}
                  {isPending && isOwner && (
                    <button
                      onClick={() => handleCancelRequest(leave.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {isPending && isAdmin && !isOwner && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setReviewingLeave(leave);
                          setReviewAction('APPROVE');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => {
                          setReviewingLeave(leave);
                          setReviewAction('REJECT');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Apply for Leave</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applyError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {applyError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Leave Type</label>
                <select
                  name="leave_type"
                  value={applyFormData.leave_type}
                  onChange={handleApplyChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="EARNED">Earned Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={applyFormData.start_date}
                    onChange={handleApplyChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={applyFormData.end_date}
                    onChange={handleApplyChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason for Leave</label>
                <textarea
                  name="reason"
                  rows={3}
                  value={applyFormData.reason}
                  onChange={handleApplyChange}
                  placeholder="Provide reason for time-off request..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Review Note Modal */}
      {reviewingLeave && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              {reviewAction === 'APPROVE' ? 'Approve Leave Request' : 'Reject Leave Request'}
            </h3>
            <p className="text-xs text-slate-400">
              Employee: <strong className="text-white">{reviewingLeave.employee_name}</strong> ({reviewingLeave.leave_type_display})
            </p>

            <div className="text-xs space-y-2">
              <label className="block text-slate-300 font-semibold">Admin Note / Comment (Optional)</label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add optional review comment..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setReviewingLeave(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={processingReview}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50 ${
                  reviewAction === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {processingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Confirm {reviewAction === 'APPROVE' ? 'Approval' : 'Rejection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
