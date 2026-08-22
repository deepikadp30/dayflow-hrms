import React, { useState, useEffect } from 'react';
import { payrollApi } from '../api/payrollApi';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  User, 
  Building, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function PayrollDetailPage({ payrollId, onBack }) {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await payrollApi.getPayrollDetail(payrollId);
        setPayroll(data);
      } catch (err) {
        console.error('Failed to fetch payroll detail:', err);
        setError(err.message || 'Failed to load payslip record.');
      } finally {
        setLoading(false);
      }
    };
    if (payrollId) fetchDetail();
  }, [payrollId]);

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3 max-w-3xl mx-auto">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading payslip details...</p>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 space-y-3 max-w-3xl mx-auto">
        <AlertCircle className="w-8 h-8 mx-auto" />
        <p className="text-xs font-medium">{error || 'Payslip record not found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
        >
          Back to Payroll
        </button>
      </div>
    );
  }

  const basic = parseFloat(payroll.basic_salary) || 0;
  const allowances = parseFloat(payroll.allowances) || 0;
  const deductions = parseFloat(payroll.deductions) || 0;
  const net = parseFloat(payroll.net_salary) || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <button
        onClick={onBack}
        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Payroll List</span>
      </button>

      {/* Payslip Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-400" />
              <h2 className="text-lg font-bold text-white">Official Salary Statement</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">Pay Period: Month {payroll.pay_period_month}, {payroll.pay_period_year}</p>
          </div>

          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
            payroll.payment_status === 'PAID'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{payroll.payment_status_display || payroll.payment_status}</span>
          </span>
        </div>

        {/* Employee Summary */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold">Employee Name</span>
            <p className="font-bold text-white text-sm mt-0.5">{payroll.employee_name}</p>
            <p className="text-slate-400 font-mono text-[11px]">ID: {payroll.employee_id || payroll.user_id}</p>
          </div>

          <div>
            <span className="text-slate-500 uppercase text-[10px] font-bold">Department</span>
            <p className="font-bold text-white text-sm mt-0.5">{payroll.department || 'N/A'}</p>
            <p className="text-slate-400 text-[11px]">Payment Date: {payroll.payment_date || 'Pending'}</p>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Breakdown</h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-300 font-semibold">Basic Earnings</span>
              <span className="font-mono text-white font-bold">${basic.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-emerald-400 font-semibold">+ Allowances & Bonuses</span>
              <span className="font-mono text-emerald-400 font-bold">+${allowances.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <span className="text-rose-400 font-semibold">- Statutory Deductions</span>
              <span className="font-mono text-rose-400 font-bold">-${deductions.toFixed(2)}</span>
            </div>

            <div className="flex justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30">
              <span className="text-sm font-bold text-white">Total Net Payable</span>
              <span className="text-lg font-bold font-mono text-emerald-400">${net.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {payroll.notes && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-300">Notes:</strong> {payroll.notes}
          </div>
        )}
      </div>
    </div>
  );
}
