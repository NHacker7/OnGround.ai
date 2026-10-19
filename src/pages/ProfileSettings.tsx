import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  ShieldCheck,
  Edit3,
  Check,
  X,
  ArrowLeft,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Headphones,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile } from '../types';
import { Badge } from '../components/common/Badge';

const PRESET_AVATARS = [
  {
    label: 'Alex (Default)',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Nishma / Executive',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Professional Female',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Professional Male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Senior Lead',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sales Specialist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

export const ProfileSettings: React.FC = () => {
  const { userProfile, updateUserProfile, setActiveScreen } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 30;
    const birthDate = new Date(dobString);
    const today = new Date(2026, 9, 19); // Reference year
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(18, age);
  };

  const formatDateOfBirth = (dobString: string) => {
    if (!dobString) return 'Not specified';
    try {
      const parts = dobString.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return dobString;
    } catch {
      return dobString;
    }
  };

  const handleStartEdit = () => {
    setFormData({ ...userProfile });
    setErrors({});
    setIsEditing(true);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setFormData({ ...userProfile });
    setErrors({});
    setIsEditing(false);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    }

    if (!formData.title.trim()) {
      errs.title = 'Job title is required.';
    }

    if (!formData.department.trim()) {
      errs.department = 'Department is required.';
    }

    if (!formData.dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    updateUserProfile(formData);
    setIsEditing(false);
    setSuccessMessage('Profile and settings updated successfully! Synchronized across all screens.');

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const currentAge = calculateAge(userProfile.dateOfBirth);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ivory-border">
        <div>
          <button
            type="button"
            onClick={() => setActiveScreen('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage hover:text-sage-hover mb-2 group transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">
              Profile & Account Settings
            </h1>
            <Badge variant="sage" size="sm">
              Shift Active
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage your agent profile, direct contact line, and telephony preferences.
          </p>
        </div>

        {/* Action Button */}
        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="px-4 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95 self-start sm:self-auto"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 shadow-soft animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{successMessage}</p>
              <p className="text-[11px] text-emerald-700">
                Your greeting and user records have been updated in localStorage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="p-1 text-emerald-700 hover:text-emerald-900 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-ivory-border shadow-soft relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Status Badge */}
          <div className="relative shrink-0">
            <img
              src={isEditing ? formData.avatar : userProfile.avatar}
              alt={userProfile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-sage-light shadow-md"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-xs"
              title="Agent Online"
            />
          </div>

          {/* User Details Overview */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-bold text-charcoal tracking-tight">
                {isEditing ? formData.name || 'Your Name' : userProfile.name}
              </h2>
              <Badge variant="sage" size="sm" className="self-center sm:self-auto">
                {isEditing ? formData.department || 'Department' : userProfile.department}
              </Badge>
            </div>

            <p className="text-sm font-semibold text-charcoal-muted mt-1">
              {isEditing ? formData.title || 'Job Title' : userProfile.title}
            </p>

            {/* Quick Contact & Bio Bar */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-sage" />
                {isEditing ? formData.email || 'email@company.com' : userProfile.email}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-sage-text font-semibold">
                <Phone className="w-3.5 h-3.5 text-sage" />
                {isEditing ? formData.phone || '+1 ...' : userProfile.phone}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-sage" />
                Age {currentAge} ({formatDateOfBirth(userProfile.dateOfBirth)})
              </span>
            </div>

            <p className="text-xs text-charcoal-muted mt-3 leading-relaxed max-w-2xl">
              {isEditing ? formData.bio || 'Professional bio...' : userProfile.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Main Body: View Mode vs Edit Mode */}
      {!isEditing ? (
        /* READ-ONLY VIEW MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Personal Credentials */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-border">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <User className="w-4 h-4 text-sage" />
                Personal Information
              </h3>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Full Legal Name
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block">
                  {userProfile.name}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Date of Birth & Age
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block">
                  {formatDateOfBirth(userProfile.dateOfBirth)}
                </span>
                <span className="text-[11px] font-semibold text-sage">({currentAge} years old)</span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Email Address
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block truncate">
                  {userProfile.email}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Direct Phone Number
                </span>
                <span className="text-sm font-bold font-mono text-sage-text mt-0.5 block">
                  {userProfile.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Professional & Telephony Credentials */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ivory-border">
              <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sage" />
                Role & Telephony Assignment
              </h3>
              <Badge variant="gold" size="sm">
                Enterprise Seat
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Job Title
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block">
                  {userProfile.title}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Department
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block">
                  {userProfile.department}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Direct Extension
                </span>
                <span className="text-sm font-bold font-mono text-charcoal mt-0.5 block">
                  {userProfile.directExtension || 'Ext. 4022'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-ivory-subtle/50 border border-ivory-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                  Operating Timezone
                </span>
                <span className="text-sm font-bold text-charcoal mt-0.5 block">
                  {userProfile.timeZone || 'America/Los_Angeles (PST)'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Shift & Calling Preferences */}
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2 pb-3 border-b border-ivory-border">
              <Headphones className="w-4 h-4 text-sage" />
              Telephony Engine Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/40">
                <span className="text-[11px] font-bold text-charcoal block">Active SIP Voice Line</span>
                <p className="text-[11px] text-charcoal-muted mt-1">
                  On-Ground.ai Ultra-Low Latency Carrier (<span className="text-emerald-700 font-bold">198ms</span>)
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/40">
                <span className="text-[11px] font-bold text-charcoal block">Call Redaction & PCI-DSS</span>
                <p className="text-[11px] text-charcoal-muted mt-1">
                  Automated audio DTMF silencing enabled
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-ivory-border bg-ivory-subtle/40">
                <span className="text-[11px] font-bold text-charcoal block">AI Coaching Co-Pilot</span>
                <p className="text-[11px] text-charcoal-muted mt-1">
                  AvaniBot Live Assist connected to Pulse channel
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EDITING FORM MODE */
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sage-border shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ivory-border">
              <div>
                <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-sage" />
                  Edit Profile & Credentials
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Update your contact card, avatar, and personal details.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2 rounded-xl border border-ivory-border bg-white text-xs font-semibold text-charcoal hover:bg-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Avatar Selector Gallery */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-2">
                Choose Profile Photo / Avatar
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-3">
                {PRESET_AVATARS.map((preset, idx) => {
                  const isSelected = formData.avatar === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: preset.url }))}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-sage bg-sage-light/60 ring-2 ring-sage shadow-xs'
                          : 'border-ivory-border bg-ivory-subtle/40 hover:bg-ivory'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <span className="text-[10px] font-semibold text-charcoal truncate w-full text-center">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Or custom URL */}
              <div>
                <label className="block text-[11px] font-semibold text-charcoal-muted mb-1">
                  Or enter custom Image URL:
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-ivory-subtle border border-ivory-border rounded-xl text-xs text-charcoal focus:outline-none focus:border-sage"
                />
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g. Nishma Patel or Alex Chen"
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-semibold text-charcoal focus:outline-none ${
                    errors.name ? 'border-red-400 bg-red-50/40' : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="e.g. nishma@on-ground.ai"
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-semibold text-charcoal focus:outline-none ${
                    errors.email ? 'border-red-400 bg-red-50/40' : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Direct Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  placeholder="+1 (415) 555-0143"
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-mono font-semibold text-charcoal focus:outline-none ${
                    errors.phone ? 'border-red-400 bg-red-50/40' : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }));
                    if (errors.dateOfBirth) setErrors((prev) => ({ ...prev, dateOfBirth: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-semibold text-charcoal focus:outline-none ${
                    errors.dateOfBirth
                      ? 'border-red-400 bg-red-50/40'
                      : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {formData.dateOfBirth && (
                  <p className="text-[10px] text-sage font-semibold mt-1">
                    Calculated Age: {calculateAge(formData.dateOfBirth)} years old
                  </p>
                )}
                {errors.dateOfBirth && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g. Senior Account Executive or Lead Sales Engineer"
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-semibold text-charcoal focus:outline-none ${
                    errors.title ? 'border-red-400 bg-red-50/40' : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {errors.title && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block font-bold text-charcoal mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, department: e.target.value }));
                    if (errors.department) setErrors((prev) => ({ ...prev, department: '' }));
                  }}
                  placeholder="e.g. Enterprise Sales & Telephony"
                  className={`w-full px-3.5 py-2.5 bg-ivory-subtle border rounded-xl text-xs font-semibold text-charcoal focus:outline-none ${
                    errors.department
                      ? 'border-red-400 bg-red-50/40'
                      : 'border-ivory-border focus:border-sage'
                  }`}
                />
                {errors.department && (
                  <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Bio */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Professional Bio & Pitch Specialization
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
                placeholder="Share your focus area, carrier experience, and deal specializations..."
                className="w-full p-3 bg-ivory-subtle border border-ivory-border rounded-xl text-xs text-charcoal focus:outline-none focus:border-sage leading-relaxed"
              />
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ivory-border">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 rounded-xl border border-ivory-border bg-white text-xs font-bold text-charcoal hover:bg-ivory transition-colors"
              >
                Cancel (Discard Changes)
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
