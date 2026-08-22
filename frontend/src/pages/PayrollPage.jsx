import React, { useState, useEffect } from 'react';
import { payrollApi } from '../api/payrollApi';
import { employeeApi } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  FileText, 
  X, 
  Edit3, 
  Send,
  Eye
} from 'lucide-react';

export default function PayrollPage({ onViewDetail }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    basic_salary: '',
    allowances: '0.00',
    deductions: '0.00',
    pay_period_month: new Date().getMonth() + 1,
    pay_period_year: new Date().getFullYear(),
    payment_status: 'PENDING',
    payment_date: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const fetchPayrolls = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await payrollApi.getPayrolls({
        payment_status: statusFilter,
        month: monthFilter,
      });
      const list = Array.isArray(data) ? data : (data.results || []);
      setPayrolls(list);
    } catch (err) {
      console.error('Failed to fetch payroll records:', err);
      setError(err.message || 'Failed to load payroll data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeList = async () => {
    if (!isAdmin) return;
    try {
      const data = await employeeApi.getEmployees();
      const list = Array.isArray(data) ? data : (data.results || []);
      setEmployees(list);
    } catch (err) {
      console.error('Failed to load employee list for payroll form:', err);
    }
  };

  useEffect(() => {
    fetchPayrolls();
    fetchEmployeeList();
  }, [statusFilter, monthFilter]);

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({
      user_id: employees.length > 0 ? employees[0].user_id : '',
      basic_salary: '',
      allowances: '0.00',
      deductions: '0.00',
      pay_period_month: new Date().getMonth() + 1,
      pay_period_year: new Date().getFullYear(),
      payment_status: 'PENDING',
      payment_date: '',
      notes: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      user_id: record.user_id,
      basic_salary: record.basic_salary,
      allowances: record.allowances,
      deductions: record.deductions,
      pay_period_month: record.pay_period_month,
      pay_period_year: record.pay_period_year,
      payment_status: record.payment_status,
      payment_date: record.payment_date || '',
      notes: record.notes || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  // Compute preview Net Salary
  const calcNetSalary = () => {
    const basic = parseFloat(formData.basic_salary) || 0;
    const allow = parseFloat(formData.allowances) || 0;
    const deduct = parseFloat(formData.deductions) || 0;
    return (basic + allow - deduct).toFixed(2);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.basic_salary || parseFloat(formData.basic_salary) < 0) {
      setFormError('Please enter a valid non-negative basic salary.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');
    try {
      if (editingRecord) {
        await payrollApi.updatePayroll(editingRecord.id, formData);
      } else {
        await payrollApi.createPayroll(formData);
      }
      setShowModal(false);
      await fetchPayrolls();
    } catch (err) {
      setFormError(err.message || 'Failed to save payroll record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Summaries
  const totalDisbursed = payrolls.reduce((acc, p) => acc + (parseFloat(p.net_salary) || 0), 0);
  const paidCount = payrolls.filter(p => p.payment_status === 'PAID').length;
  const pendingCount = payrolls.filter(p => p.payment_status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Payroll & Compensation</h1>
            <p className="text-xs text-slate-400 mt-1">
              Salary structures, payslip calculations, and payment status tracking
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Process New Payroll</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Net Payroll</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Paid Records</span>
            <p className="text-xl font-bold text-white mt-1">{paidCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Processing</span>
            <p className="text-xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold">Filter Status:</span>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Payment Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSED">Processed</option>
            <option value="PAID">Paid</option>
          </select>

          {(statusFilter || monthFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setMonthFilter(''); }}
              className="text-brand-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          Showing {payrolls.length} payroll record(s)
        </span>
      </div>

      {/* Payroll Table */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading payroll records from DRF backend...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 flex flex-col items-center space-y-3">
          <AlertCircle className="w-8 h-8" />
          <p className="text-xs font-medium">{error}</p>
        </div>
      ) : payrolls.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Payroll Records Found</h3>
          <p className="text-xs text-slate-400">
            {isAdmin ? 'Click "Process New Payroll" above to generate a salary record.' : 'No salary records published for your account yet.'}
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Pay Period</th>
                <th className="p-3">Basic Salary</th>
                <th className="p-3">Allowances</th>
                <th className="p-3">Deductions</th>
                <th className="p-3">Net Salary</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payrolls.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3">
                    <span className="font-bold text-white">{record.employee_name}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">ID: {record.employee_id || record.user_id}</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">
                    {record.pay_period_month}/{record.pay_period_year}
                  </td>
                  <td className="p-3 font-mono">${parseFloat(record.basic_salary).toFixed(2)}</td>
                  <td className="p-3 font-mono text-emerald-400">+${parseFloat(record.allowances).toFixed(2)}</td>
                  <td className="p-3 font-mono text-rose-400">-${parseFloat(record.deductions).toFixed(2)}</td>
                  <td className="p-3 font-bold font-mono text-emerald-400 text-sm">
                    ${parseFloat(record.net_salary).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      record.payment_status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : record.payment_status === 'PROCESSED'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {record.payment_status_display || record.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {onViewDetail && (
                      <button
                        onClick={() => onViewDetail(record.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                      >
                        View Slip
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleOpenEditModal(record)}
                        className="px-2.5 py-1 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 font-semibold transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Payroll Modal (Admin Only) */}
      {showModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingRecord ? 'Edit Payroll Record' : 'Process New Payroll Record'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              {!editingRecord && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Employee</label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.user_id}>
                        {emp.full_name || emp.username} ({emp.employee_id}) - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pay Period Month (1-12)</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    name="pay_period_month"
                    value={formData.pay_period_month}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pay Period Year</label>
                  <input
                    type="number"
                    name="pay_period_year"
                    value={formData.pay_period_year}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="basic_salary"
                    value={formData.basic_salary}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Allowances ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Net Salary Preview */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-slate-400">Calculated Net Salary:</span>
                <span className="text-base font-bold text-emerald-400 font-mono">${calcNetSalary()}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Status</label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSED">Processed</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Payment Date (Optional)</label>
                  <input
                    type="date"
                    name="payment_date"
                    value={formData.payment_date}
                    onChange={handleFormChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{editingRecord ? 'Update Record' : 'Save Payroll'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
