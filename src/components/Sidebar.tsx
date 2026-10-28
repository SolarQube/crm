import React from 'react';
import { IMAGES } from '../assets/images';
import { UserRole } from '../types/crm';
import { TEAM_MEMBERS } from '../data/initialData';
import { ROLE_PERMISSIONS, isTabAllowed } from '../utils/rbac';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  Compass, 
  FileText, 
  Calculator, 
  Truck, 
  Wrench, 
  MessageSquare, 
  Calendar, 
  Globe, 
  Database, 
  Search, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  X,
  Lock,
  Sun,
  Moon,
  Clock,
  CalendarDays,
  LogOut
} from 'lucide-react';
import { AuthUser } from '../data/authUsers';

export type MainNavTab = 
  | 'dashboard' 
  | 'leads' 
  | 'pipeline' 
  | 'survey' 
  | 'quotations' 
  | 'delivery' 
  | 'schedule' 
  | 'aftersales' 
  | 'automations' 
  | 'calculator'
  | 'attendance';

interface SidebarProps {
  currentTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  leadsCount: number;
  pendingTasksCount: number;
  untouchedAlertCount: number;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  onOpenTasksModal: () => void;
  onOpenWebsiteForm: () => void;
  onOpenImportExport: () => void;
  onOpenCommandPalette: () => void;
  onOpenRoleMatrix: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  leadsCount,
  pendingTasksCount,
  untouchedAlertCount,
  userRole,
  onChangeUserRole,
  onOpenTasksModal,
  onOpenWebsiteForm,
  onOpenImportExport,
  onOpenCommandPalette,
  onOpenRoleMatrix,
  isMobileOpen,
  onCloseMobile,
  currentUser,
  onLogout
}) => {
  const currentMember = TEAM_MEMBERS.find(m => m.role === userRole) || TEAM_MEMBERS[0];
  const permissions = ROLE_PERMISSIONS[userRole];

  const handleNavClick = (tab: MainNavTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#080c22] border-r border-slate-200 dark:border-slate-800/90 flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="min-w-0">
            <div className="inline-flex rounded-lg dark:bg-white dark:px-2.5 dark:py-1.5">
              <img
                src={IMAGES.logo}
                alt="SolarQube Energy"
                className="h-9 w-auto max-w-full select-none"
                draggable={false}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/20 tracking-wider">
                EPC OS
              </span>
              <span className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                Clean Energy CRM
              </span>
            </div>
          </div>

          <button 
            onClick={onCloseMobile}
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Card & Switcher */}
        <div className="px-3 pt-3 pb-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/90 space-y-2.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                <span>ROLE CONSOLE</span>
              </span>
              <button
                onClick={onOpenRoleMatrix}
                title="View what data is visible to each role"
                className="text-[11px] text-brand-600 dark:text-brand-400 font-mono font-bold hover:underline cursor-pointer"
              >
                RBAC Matrix
              </button>
            </div>

            {/* Current Logged In User Header */}
            {currentUser && (
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${currentUser.avatarBg}`}>
                  {currentUser.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                Active Role:
              </label>
              <select
                value={userRole}
                onChange={e => onChangeUserRole(e.target.value as UserRole)}
                className="w-full text-xs font-bold bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-hidden focus:border-brand-500 cursor-pointer shadow-xs"
              >
                <option value="admin">Sneha Patel (Admin / MD)</option>
                <option value="hr">Pooja Nair (HR & Payroll)</option>
                <option value="sales">Ananya Sharma (Sales Lead)</option>
                <option value="project_coordinator">Rajesh Menon (Project Coord)</option>
                <option value="site_engineer">Vikram Rao (Site Engineer)</option>
                <option value="installer">Kiran Verma (Installer Crew)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="truncate">{permissions.department}</span>
              {!permissions.canViewFinancials ? (
                <span className="flex items-center gap-0.5 text-brand-600 dark:text-brand-400 font-mono font-medium">
                  <Lock className="w-2.5 h-2.5" />
                  <span>No Financials</span>
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                  Financials Unlocked
                </span>
              )}
            </div>

            {/* Sign Out Action */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full mt-1 py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Launcher */}
        <div className="px-3 py-1.5">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search leads & specs</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Tabs - Role Scoped */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-4 text-xs font-medium">
          
          {/* Group 1: Core Operations */}
          <div className="space-y-1">
            <span className="px-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Core CRM
            </span>

            {isTabAllowed(userRole, 'dashboard') && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Executive Dashboard</span>
              </button>
            )}

            {isTabAllowed(userRole, 'leads') && (
              <button
                onClick={() => handleNavClick('leads')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'leads'
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Customer Leads</span>
                </div>
                <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                  currentTab === 'leads' ? 'bg-slate-950 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {leadsCount}
                </span>
              </button>
            )}

            {isTabAllowed(userRole, 'pipeline') && (
              <button
                onClick={() => handleNavClick('pipeline')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'pipeline'
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Kanban className="w-4 h-4 shrink-0" />
                <span>Sales Pipeline</span>
              </button>
            )}
          </div>

          {/* Group 2: Solar Engineering & Survey */}
          {(isTabAllowed(userRole, 'survey') || isTabAllowed(userRole, 'quotations') || isTabAllowed(userRole, 'calculator')) && (
            <div className="space-y-1">
              <span className="px-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Engineering & Quotes
              </span>

              {isTabAllowed(userRole, 'survey') && (
                <button
                  onClick={() => handleNavClick('survey')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'survey'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Site Survey & CAD</span>
                </button>
              )}

              {isTabAllowed(userRole, 'quotations') && (
                <button
                  onClick={() => handleNavClick('quotations')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'quotations'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Quotations & ROI</span>
                </button>
              )}

              {isTabAllowed(userRole, 'calculator') && (
                <button
                  onClick={() => handleNavClick('calculator')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'calculator'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>Sizing Studio</span>
                </button>
              )}
            </div>
          )}

          {/* Group 3: Project Delivery & Field Execution */}
          {(isTabAllowed(userRole, 'delivery') || isTabAllowed(userRole, 'schedule') || isTabAllowed(userRole, 'aftersales') || isTabAllowed(userRole, 'automations')) && (
            <div className="space-y-1">
              <span className="px-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Field Delivery & Crew
              </span>

              {isTabAllowed(userRole, 'schedule') && (
                <button
                  onClick={() => handleNavClick('schedule')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'schedule'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span>Team Scheduler</span>
                  </div>
                  <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    currentTab === 'schedule'
                      ? 'bg-slate-950 text-white'
                      : 'bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20'
                  }`}>
                    Teams A&B
                  </span>
                </button>
              )}

              {isTabAllowed(userRole, 'delivery') && (
                <button
                  onClick={() => handleNavClick('delivery')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'delivery'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Installation & Stock</span>
                </button>
              )}

              {isTabAllowed(userRole, 'aftersales') && (
                <button
                  onClick={() => handleNavClick('aftersales')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'aftersales'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>AMC & Complaints</span>
                </button>
              )}

              {isTabAllowed(userRole, 'automations') && (
                <button
                  onClick={() => handleNavClick('automations')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'automations'
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>WhatsApp & Drips</span>
                  </div>
                  {untouchedAlertCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Group 4: Site Attendance & Labor Tracking */}
          {isTabAllowed(userRole, 'attendance') && (
            <div className="space-y-1">
              <span className="px-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                People & Project Labor
              </span>

              <button
                onClick={() => handleNavClick('attendance')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'attendance'
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 text-brand-500" />
                  <span>Attendance & Labor</span>
                </div>
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  GPS Site
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Role Scope Tag & Tools */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-950/60 space-y-1.5">
          {/* Tasks launcher */}
          <button
            onClick={onOpenTasksModal}
            className="w-full px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              <span>Assigned Tasks</span>
            </div>
            {pendingTasksCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-700 dark:text-brand-300 font-bold border border-brand-500/30">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Website Form Preview */}
          {(userRole === 'admin' || userRole === 'sales') && (
            <button
              onClick={onOpenWebsiteForm}
              className="w-full px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Website Form Preview</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          )}

          {/* CSV & Backup - Admin only */}
          {userRole === 'admin' && (
            <button
              onClick={onOpenImportExport}
              className="w-full px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white text-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>CSV & Data Backup</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          )}

          {/* Data Visibility Matrix Launcher */}
          <button
            onClick={onOpenRoleMatrix}
            className="w-full px-2.5 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 text-xs flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Data Security Matrix</span>
            </div>
            <span className="text-[11px] font-mono font-bold">RBAC</span>
          </button>
        </div>

      </aside>
    </>
  );
};
