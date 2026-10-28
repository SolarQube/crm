import React, { useState } from 'react';
import { IMAGES } from '../assets/images';
import { AUTH_USERS, AuthUser, authenticateUser, UNIVERSAL_DEMO_PASSWORD } from '../data/authUsers';
import { UserRole } from '../types/crm';
import { 
  Sun, 
  Moon, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  KeyRound, 
  UserCheck, 
  Zap, 
  Building2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
  theme: 'daylight' | 'obsidian';
  onToggleTheme: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  theme,
  onToggleTheme
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRoleCard, setSelectedRoleCard] = useState<UserRole | null>(null);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = authenticateUser(emailInput, passwordInput);
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setErrorMessage(result.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickLoginAsRole = (user: AuthUser) => {
    setEmailInput(user.email);
    setPasswordInput(user.password);
    setSelectedRoleCard(user.role);
    setErrorMessage(null);

    // Provide smooth instant feedback
    setTimeout(() => {
      onLogin(user);
    }, 150);
  };

  const handleSelectRoleToForm = (user: AuthUser) => {
    setEmailInput(user.email);
    setPasswordInput(user.password);
    setSelectedRoleCard(user.role);
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen ${theme === 'obsidian' ? 'dark' : ''} bg-slate-50 dark:bg-[#080c22] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors`}>
      
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 px-6 sm:px-10 flex items-center justify-between bg-white/80 dark:bg-[#090e26]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="inline-flex rounded-lg dark:bg-white dark:px-2.5 dark:py-1.5">
            <img src={IMAGES.logo} alt="SolarQube Energy" className="h-9 sm:h-10 w-auto select-none" draggable={false} />
          </div>
          <div className="hidden sm:block h-9 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="hidden sm:block">
            <span className="text-[11px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/20 tracking-wider">
              EPC OS
            </span>
            <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
              Role Access & Operations Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title={theme === 'daylight' ? 'Switch to Obsidian Dark Mode' : 'Switch to Daylight Light Mode'}
          >
            {theme === 'daylight' ? <Moon className="w-4 h-4 text-slate-600" /> : <Sun className="w-4 h-4 text-brand-400" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 text-brand-800 dark:text-brand-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Role-Based Access Control (RBAC) Enabled</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Sign In to SolarQube EPC OS
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Select your role account or sign in with your work credentials. Each role operates within its designated workspace and permission matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Standard Credentials Login Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0f1635] rounded-2xl border border-slate-200 dark:border-slate-800/90 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Account Sign In
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter your assigned work email & password
                </p>
              </div>
              <KeyRound className="w-5 h-5 text-brand-500" />
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Email or Role Handle
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="e.g. sneha@solarqubeenergy.in or admin"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPasswordInput(UNIVERSAL_DEMO_PASSWORD)}
                    className="text-[12px] text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
                  >
                    Use Demo Key (solar123)
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-brand-500 focus:ring-brand-500/30 w-3.5 h-3.5"
                  />
                  <span>Remember session on this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick credentials toggle */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>View All 6 Role Passwords</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400">
                  {showDemoCredentials ? 'Hide' : 'Show'}
                </span>
              </button>

              {showDemoCredentials && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[12px] font-mono space-y-1.5 animate-fadeIn">
                  <div className="text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    Passcode for all accounts: <span className="text-brand-600 dark:text-brand-400 font-bold">solar123</span>
                  </div>
                  {AUTH_USERS.map(u => (
                    <div key={u.id} className="flex items-center justify-between py-0.5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0">
                      <span className="text-slate-700 dark:text-slate-300 font-sans">{u.name} ({u.badgeLabel}):</span>
                      <span className="text-slate-500 dark:text-slate-400">{u.password}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: One-Click Role Selector Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-500" />
                  <span>One-Click Role Login</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any team member card below to immediately log in as that role:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUTH_USERS.map(user => {
                const isSelected = selectedRoleCard === user.role;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleQuickLoginAsRole(user)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-400 dark:bg-brand-500/10 dark:border-brand-500/50 shadow-xs'
                        : 'bg-white dark:bg-[#0f1635] border-slate-200 dark:border-slate-800/90 hover:border-brand-400/80 dark:hover:border-brand-500/60 hover:shadow-xs'
                    }`}
                  >
                    {/* Header with avatar & role badge */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${user.avatarBg}`}>
                          {user.avatarInitials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono leading-tight break-all">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                        {user.badgeLabel}
                      </span>
                    </div>

                    {/* Title & Department */}
                    <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {user.title}
                    </div>

                    {/* Scope description */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {user.allowedScopesDescription}
                    </p>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[12px]">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {user.department}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Sign In</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security Architecture Callout */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-[12px] leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Zero Trust Role Boundary: </span>
                HR staff have no customer pricing access. Sales cannot view internal installer costing. Site crew access is limited strictly to assigned installation stages.
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>SolarQube Clean Energy Systems • EPC Operating System v2.6 • Bengaluru, India</span>
      </footer>

    </div>
  );
};
