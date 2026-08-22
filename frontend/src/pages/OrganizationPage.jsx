import React, { useState, useEffect } from 'react';
import { organizationApi } from '../api/organizationApi';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  Edit3, 
  Loader2, 
  AlertCircle, 
  X, 
  Save, 
  ShieldCheck 
} from 'lucide-react';

export default function OrganizationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.is_admin_hr;

  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    website: '',
    timezone: 'UTC',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchOrg = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await organizationApi.getOrganization();
      setOrg(data);
      setFormData({
        company_name: data.company_name || '',
        company_email: data.company_email || '',
        company_phone: data.company_phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || '',
        postal_code: data.postal_code || '',
        website: data.website || '',
        timezone: data.timezone || 'UTC',
      });
    } catch (err) {
      console.error('Failed to fetch organization info:', err);
      setError(err.message || 'Failed to load organization profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (saveError) setSaveError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!org?.id) return;
    setSaving(true);
    setSaveError('');
    try {
      const updated = await organizationApi.updateOrganization(org.id, formData);
      setOrg(updated);
      setShowEditModal(false);
    } catch (err) {
      setSaveError(err.message || 'Failed to update organization settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3 max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        <p className="text-xs text-slate-400">Loading Organization profile from DRF backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 space-y-3 max-w-4xl mx-auto">
        <AlertCircle className="w-8 h-8 mx-auto" />
        <p className="text-xs font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{org?.company_name || 'Organization Profile'}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Company contact details, headquarters address, and operating location
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Company Profile</span>
          </button>
        )}
      </div>

      {/* Organization Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Mail className="w-4 h-4 text-brand-400" />
            <span>Company Contact & Web</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Company Name</span>
              <p className="text-white font-bold text-sm mt-0.5">{org?.company_name}</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Official Email</span>
              <p className="text-slate-200 font-mono mt-0.5">{org?.company_email}</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Phone Number</span>
              <p className="text-slate-200 mt-0.5">{org?.company_phone}</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Official Website</span>
              <a
                href={org?.website}
                target="_blank"
                rel="noreferrer"
                className="text-brand-400 hover:underline block font-mono mt-0.5"
              >
                {org?.website}
              </a>
            </div>
          </div>
        </div>

        {/* Location & Timezone */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span>Headquarters Address</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Street Address</span>
              <p className="text-white font-semibold mt-0.5">{org?.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">City / State</span>
                <p className="text-slate-200 mt-0.5">{org?.city}, {org?.state}</p>
              </div>

              <div>
                <span className="text-slate-500 uppercase text-[10px] font-bold">Postal Code</span>
                <p className="text-slate-200 font-mono mt-0.5">{org?.postal_code}</p>
              </div>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Country</span>
              <p className="text-slate-200 mt-0.5">{org?.country}</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase text-[10px] font-bold">Operating Timezone</span>
              <span className="inline-block mt-1 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 font-mono text-[11px] border border-brand-500/20">
                {org?.timezone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Organization Modal (Admin Only) */}
      {showEditModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Organization Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    name="company_phone"
                    value={formData.company_phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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
                  <span>Save Organization</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
