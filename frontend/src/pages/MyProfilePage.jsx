import React, { useState, useEffect } from 'react';
import { employeeApi } from '../api/employeeApi';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Shield, 
  Edit3, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';

export default function MyProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Self Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchMyProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeApi.getMyProfile();
      setProfile(data);
      setEditFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (err) {
      console.error('Failed to fetch personal profile:', err);
      setError(err.message || 'Failed to load personal profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    if (saveError) setSaveError('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSaveSelfUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSuccessMsg('');
    try {
      const updated = await employeeApi.updateMyProfile(editFormData);
      setProfile(updated);
      await refreshUser(); // Update AuthContext state
      setSuccessMsg('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3 max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading your profile record...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 flex flex-col items-center space-y-3 max-w-4xl mx-auto">
        <AlertCircle className="w-8 h-8" />
        <p className="text-xs font-medium">{error || 'Profile unavailable.'}</p>
        <button
          onClick={fetchMyProfile}
          className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const initials = profile.first_name && profile.last_name 
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile.username.slice(0, 2).toUpperCase();

  const isAdmin = profile.role === 'ADMIN' || user?.is_admin_hr;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 border border-slate-700 flex items-center justify-center text-xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{profile.full_name}</h1>
            <p className="text-xs text-brand-400 font-semibold">{profile.designation}</p>
            <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
              ID: {profile.employee_id || `EMP-${profile.user_id}`}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center space-x-2"
        >
          <Edit3 className="w-4 h-4 text-brand-400" />
          <span>Edit Profile</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>Personal Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Username</span>
              <span className="font-mono text-brand-400 font-semibold">{profile.username}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Email</span>
              <span className="font-semibold text-slate-200">{profile.email || 'Not set'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Phone</span>
              <span className="font-semibold text-slate-200">{profile.phone || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Organization Profile</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Department</span>
              <span className="font-semibold text-slate-200">{profile.department || 'General'}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Designation</span>
              <span className="font-semibold text-slate-200">{profile.designation}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Employment Type</span>
              <span className="font-semibold text-slate-200">{profile.employment_type_display || profile.employment_type}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-slate-400">Account Role</span>
              <span className={`font-semibold px-2 py-0.5 rounded ${
                isAdmin ? 'bg-indigo-500/20 text-indigo-400' : 'bg-brand-500/20 text-brand-400'
              }`}>
                {isAdmin ? 'Admin / HR' : 'Employee'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Self Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Update Personal Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveSelfUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
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
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-500 flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
