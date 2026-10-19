import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Building2,
  LogOut,
  RefreshCw,
  Settings,
  Mail,
  Key,
  Globe,
  ArrowUpRight,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';

export interface DoctorUser {
  id: string;
  name: string;
  title: string;
  email: string;
  licenseNumber: string;
  initials: string;
  clinicName: string;
  role: 'owner' | 'physician' | 'nurse_injector';
  avatarBg: string;
  avatarColor: string;
  avatarUrl?: string;
  status: 'active' | 'on_break' | 'in_consultation';
  sessionStartedAt?: string;
}

export const DR_DEMO: DoctorUser = {
  id: 'dr-demo',
  name: 'Dr. Sarah Jenkins, M.D.',
  title: 'Medical Director & Practice Owner',
  email: 'dr.demo@auramedspa.com',
  licenseNumber: 'CA-MED-88912',
  initials: 'SJ',
  clinicName: 'Aura MedSpa & Aesthetics',
  role: 'owner',
  avatarBg: '#F5ECE5',
  avatarColor: '#8C6D58',
  status: 'active',
  sessionStartedAt: 'Today at 08:00 AM'
};

export const AVAILABLE_DOCTORS: DoctorUser[] = [
  DR_DEMO,
  {
    id: 'dr-marcus',
    name: 'Dr. Marcus Vance, M.D.',
    title: 'Lead Aesthetic Dermatologist',
    email: 'm.vance@auramedspa.com',
    licenseNumber: 'CA-MED-77401',
    initials: 'MV',
    clinicName: 'Aura MedSpa & Aesthetics',
    role: 'physician',
    avatarBg: '#E0F2FE',
    avatarColor: '#0369A1',
    status: 'in_consultation',
    sessionStartedAt: 'Today at 09:15 AM'
  },
  {
    id: 'nurse-olivia',
    name: 'Olivia Vance, RN',
    title: 'Master Aesthetic Injector',
    email: 'olivia.v@auramedspa.com',
    licenseNumber: 'CA-RN-55210',
    initials: 'OV',
    clinicName: 'Aura MedSpa & Aesthetics',
    role: 'nurse_injector',
    avatarBg: '#F3E8FF',
    avatarColor: '#7E22CE',
    status: 'active',
    sessionStartedAt: 'Today at 08:30 AM'
  }
];

interface DoctorAuthViewProps {
  onLoginSuccess: (doctor: DoctorUser) => void;
  onToast: (msg: string) => void;
  onCancel?: () => void;
}

export const DoctorAuthView: React.FC<DoctorAuthViewProps> = ({
  onLoginSuccess,
  onToast,
  onCancel
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('dr.demo@auramedspa.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('');
  const [license, setLicense] = useState('');
  const [clinicName, setClinicName] = useState('Aura MedSpa & Aesthetics');
  const [showPassword, setShowPassword] = useState(false);

  const handleQuickDemoLogin = () => {
    onToast('⚡ Signed in as Dr. Demo (Medical Director Session Active).');
    onLoginSuccess(DR_DEMO);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      const match = AVAILABLE_DOCTORS.find((d) => d.email.toLowerCase() === email.toLowerCase()) || DR_DEMO;
      onToast(`Welcome back, ${match.name}!`);
      onLoginSuccess(match);
    } else {
      const newDoctor: DoctorUser = {
        id: `dr-${Date.now()}`,
        name: fullName.trim() || 'Dr. Physician Demo, M.D.',
        title: 'Attending Aesthetic Physician',
        email: email.trim(),
        licenseNumber: license.trim() || 'CA-MED-99000',
        initials: (fullName.trim() || 'DP').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
        clinicName: clinicName.trim() || 'Aura MedSpa & Aesthetics',
        role: 'physician',
        avatarBg: '#E0E7FF',
        avatarColor: '#3730A3',
        status: 'active',
        sessionStartedAt: 'Just now'
      };
      onToast(`Created practitioner session for ${newDoctor.name}!`);
      onLoginSuccess(newDoctor);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 font-manrope">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Branding */}
        <div className="p-6 bg-[#1C1917] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C28E75] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              A
            </div>
            <div>
              <div className="font-serif text-lg tracking-wide text-white">Aura MedSpa &amp; OS</div>
              <div className="text-[10px] text-[#D4A373] uppercase tracking-widest font-mono">
                Quad-A Physician Portal
              </div>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Back to Site
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs text-slate-800">
          
          {/* Quick Demo Physician Session Button (Highlight) */}
          <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Instant Demo Access
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Dr. Demo Ready
              </span>
            </div>
            <p className="text-[11px] text-blue-700 leading-snug">
              Sign in with 1-click as <strong>Dr. Sarah Jenkins, M.D.</strong> (Medical Director &amp; Practice Owner) to explore clinical workflows.
            </p>
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Launch Dr. Demo Session</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Or Physician Credentials
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          {/* Tab Selector: Login vs Signup */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Doctor Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New Doctor Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physician Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Marcus Vance, M.D."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Medical License #</label>
                    <input
                      type="text"
                      required
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      placeholder="CA-MED-99410"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Clinic Name</label>
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Aura Aesthetics"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Physician Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.demo@auramedspa.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>{authMode === 'login' ? 'Authenticate Doctor Session' : 'Create Doctor Session'}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>HIPAA Verified • Quad-A Auth</span>
            <span>Carefront v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
