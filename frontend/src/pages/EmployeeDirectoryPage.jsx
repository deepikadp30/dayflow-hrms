import React, { useState, useEffect } from 'react';
import { employeeApi } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Building, 
  Shield, 
  Mail, 
  Phone, 
  Eye, 
  Edit3, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function EmployeeDirectoryPage({ onSelectEmployee }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeApi.getEmployees({
        search: searchTerm,
        department: departmentFilter,
        status: statusFilter,
        employment_type: employmentTypeFilter,
      });
      // DRF list view returns array or object with results
      const list = Array.isArray(data) ? data : (data.results || []);
      setEmployees(list);
    } catch (err) {
      console.error('Failed to fetch directory:', err);
      setError(err.message || 'Failed to load employee directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEmployees();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, departmentFilter, statusFilter, employmentTypeFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setEmploymentTypeFilter('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Employee Directory</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage workforce records, profiles, and team details
            </p>
          </div>
        </div>

        {/* Directory Metrics */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Members</span>
            <p className="text-lg font-extrabold text-white leading-none">{employees.length}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500">Active</span>
            <p className="text-lg font-extrabold text-emerald-400 leading-none">
              {employees.filter(e => e.status === 'ACTIVE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR / Administration</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Employment Type Filter */}
          <div>
            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {(searchTerm || departmentFilter || statusFilter || employmentTypeFilter) && (
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400">Filtering results...</span>
            <button
              onClick={handleResetFilters}
              className="text-brand-400 hover:text-brand-300 text-xs font-semibold flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Directory Grid / List */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          <p className="text-xs text-slate-400">Fetching employee directory from DRF backend...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 flex flex-col items-center space-y-3">
          <AlertCircle className="w-8 h-8" />
          <p className="text-xs font-medium">{error}</p>
          <button
            onClick={fetchEmployees}
            className="px-4 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : employees.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Employees Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No matching employee records found for your search/filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => {
            const initials = emp.first_name && emp.last_name 
              ? `${emp.first_name[0]}${emp.last_name[0]}`.toUpperCase()
              : emp.username.slice(0, 2).toUpperCase();

            const isEmpAdmin = emp.role === 'ADMIN';

            return (
              <div
                key={emp.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-slate-950/50 flex flex-col justify-between group"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-sm font-bold text-brand-400 group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                          {emp.full_name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{emp.designation}</p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                      emp.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {emp.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{emp.status}</span>
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="space-y-2 text-xs py-3 border-t border-b border-slate-800/60 my-3">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center space-x-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>Department:</span>
                      </span>
                      <span className="font-semibold text-slate-200">{emp.department || 'General'}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center space-x-1.5">
                        <Shield className="w-3.5 h-3.5 text-slate-500" />
                        <span>Employee ID:</span>
                      </span>
                      <span className="font-mono text-slate-300 font-semibold">{emp.employee_id || `EMP-${emp.user_id}`}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>Email:</span>
                      </span>
                      <span className="text-slate-300 truncate max-w-[150px]">{emp.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    emp.employment_type === 'FULL_TIME'
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {emp.employment_type_display || emp.employment_type}
                  </span>

                  <button
                    onClick={() => onSelectEmployee(emp.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-400" />
                    <span>View Record</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
