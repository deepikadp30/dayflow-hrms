import React, { useState, useEffect } from 'react';
import { employeeApi } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Calendar, 
  Shield, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';

export default function EmployeeDetailPage({ employeeId, onBack }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchEmployeeDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeApi.getEmployee(employeeId);
      setEmployee(data);
      setEditFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        department: data.department || '',
        designation: data.designation || '',
        employment_type: data.employment_type || 'FULL_TIME',
        status: data.status || 'ACTIVE',
        employee_id: data.employee_id || '',
      });
    } catch (err) {
      console.error('Failed to fetch employee detail:', err);
      setError(err.message || 'Failed to load employee record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetail();
    }
  }, [employeeId]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    try {
      const updated = await employeeApi.updateEmployee(employeeId, editFormData);
      setEmployee(updated);
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err.message || 'Failed to save employee changes.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading employee record...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 flex flex-col items-center space-y-3">
        <AlertCircle className="w-8 h-8" />
        <p className="text-xs font-medium">{error || 'Employee not found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      </div>
    );
  }

  const initials = employee.first_name && employee.last_name 
    ? `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase()
    : employee.username.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employee Directory</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Employee Profile</span>
          </button>
        )}
      </div>

      {/* Main Profile Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 border-2 border-slate-700 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl">
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{employee.full_name}</h1>
                <p className="text-sm font-semibold text-brand-400">{employee.designation}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-end space-x-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
                  employee.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {employee.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{employee.status}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono text-slate-200">ID: {employee.employee_id || `EMP-${employee.user_id}`}</span>
              </span>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200">{employee.department || 'General'}</span>
              </span>
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200">{employee.employment_type_display || employee.employment_type}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Mail className="w-4 h-4 text-brand-400" />
            <span>Contact Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Email Address</span>
              <span className="font-semibold text-slate-200">{employee.email || 'Not provided'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Phone Number</span>
              <span className="font-semibold text-slate-200">{employee.phone || 'Not provided'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Username</span>
              <span className="font-mono text-brand-400 font-semibold">{employee.username}</span>
            </div>
          </div>
        </div>

        {/* Employment & Role Information */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Employment Record</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Department</span>
              <span className="font-semibold text-slate-200">{employee.department || 'General'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Designation</span>
              <span className="font-semibold text-slate-200">{employee.designation}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Date of Joining</span>
              <span className="font-semibold text-slate-200">{employee.date_of_joining || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">System Role</span>
              <span className={`font-semibold px-2 py-0.5 rounded ${
                employee.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-brand-500/20 text-brand-400'
              }`}>
                {employee.role === 'ADMIN' ? 'Admin / HR' : 'Employee'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Employee Record</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {updateError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {updateError}
              </div>
            )}

            <form onSubmit={handleSaveUpdate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={editFormData.designation}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Type</label>
                  <select
                    name="employment_type"
                    value={editFormData.employment_type}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERN">Intern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
