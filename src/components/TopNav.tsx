import React from 'react';
import { MainNavTab } from './Sidebar';
import { UserRole } from '../types/crm';
import { ROLE_PERMISSIONS, canViewFinancials, maskFinancialValue } from '../utils/rbac';
import { 
  Menu, 
  Search, 
  Plus, 
  Calendar, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Sun,
  Moon,
  Users,
  Lock,
  SlidersHorizontal,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { AuthUser } from '../data/authUsers';

interface TopNavProps {
  currentTab: MainNavTab;
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  onOpenNewLead: () => void;
  onOpenTasksModal: () => void;
  onOpenRoleMatrix: () => void;
  pendingTasksCount: number;
  untouchedAlertCount: number;
  totalCapacityKw: number;
  totalPipelineValue: number;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
  assignedOnlyFilter: boolean;
  onToggleAssignedOnlyFilter: (val: boolean) => void;
  theme: 'daylight' | 'obsidian';
  onToggleTheme: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenCommandPalette,
  onOpenNewLead,
  onOpenTasksModal,
  onOpenRoleMatrix,
  pendingTasksCount,
  untouchedAlertCount,
  totalCapacityKw,
  totalPipelineValue,
  userRole,
  onChangeUserRole,
  assignedOnlyFilter,
  onToggleAssignedOnlyFilter,
  theme,
  onToggleTheme,
  currentUser,
  onLogout
}) => {
  const permissions = ROLE_PERMISSIONS[userRole];

  const getTabLabel = (tab: MainNavTab) => {
    switch (tab) {
      case 'dashboard': return 'Executive Overview';
      case 'leads': return 'Customer Leads';
      case 'pipeline': return 'Turnkey Pipeline Board';
      case 'survey': return 'Site Survey & CAD Audits';
      case 'quotations': return 'Quotations & Proposal Versions';
      case 'delivery': return 'Installation, Inventory & Payments';
      case 'schedule': return 'Resource Scheduler & Teams A & B';
      case 'aftersales': return 'After-Sales, AMC & Referrals';
      case 'automations': return 'WhatsApp & Email Automations';
      case 'calculator': return 'Solar Sizing Studio';
      case 'attendance': return 'Site Attendance & Project Labor Costing';
      default: return 'Console';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#090e26]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 px-4 sm:px-6 flex items-center justify-between gap-3 transition-colors whitespace-nowrap">
      
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 font-sans tracking-tight">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="hidden sm:inline font-mono text-[12px] uppercase tracking-wider text-slate-500 dark:text-slate-400">SOLARQUBE</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500" />
          <span className="font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {getTabLabel(currentTab)}
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-500">/</span>
          
          {/* Capacity Pill */}
          <span className="hidden 2xl:inline-flex items-center gap-1 font-mono text-[12px] text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-500/20">
            <Zap className="w-3 h-3 text-brand-500" />
            {totalCapacityKw.toLocaleString()} kWp Pipeline
          </span>

          {/* Pipeline Value (Masked if non-financial role) */}
          <span className="hidden 2xl:inline-flex items-center gap-1 font-mono text-[12px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
            {canViewFinancials(userRole) ? (
              <span>₹{(totalPipelineValue / 10000000).toFixed(2)} Cr Value</span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-slate-500" />
                <span>₹ •••••• (Role Masked)</span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Right: Quick Controls, Role Switcher, Matrix & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        
        {/* Untouched Alert Indicator */}
        {untouchedAlertCount > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{untouchedAlertCount} untouched</span>
          </div>
        )}

        {/* Role & Data Visibility Inspector Button */}
        <button
          onClick={onOpenRoleMatrix}
          title="Inspect Role-Based Access Matrix & Data Visibility Rules"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          <span className="hidden 2xl:inline">Data Visibility</span>
          <span className="text-[11px] uppercase font-mono px-1 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
            RBAC
          </span>
        </button>

        {/* Assigned vs All Scope Switcher */}
        <button
          onClick={() => onToggleAssignedOnlyFilter(!assignedOnlyFilter)}
          title={assignedOnlyFilter ? "Showing only records assigned to your profile" : "Showing all company records"}
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            assignedOnlyFilter
              ? 'bg-brand-50 border-brand-300 text-brand-800 dark:bg-brand-500/10 dark:border-brand-500/40 dark:text-brand-300'
              : 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{assignedOnlyFilter ? 'My Assigned' : 'All Leads'}</span>
        </button>

        {/* Role Switcher & User Console */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <select
            value={userRole}
            onChange={e => onChangeUserRole(e.target.value as UserRole)}
            className="text-xs font-bold bg-transparent text-slate-800 dark:text-slate-200 py-1 pl-1.5 pr-2 rounded-lg cursor-pointer focus:outline-hidden"
            title="Switch User Role to test different data visibility"
          >
            <option value="admin">Sneha (Admin / MD)</option>
            <option value="hr">Pooja (HR & Payroll)</option>
            <option value="sales">Ananya (Sales)</option>
            <option value="project_coordinator">Rajesh (Project Coord)</option>
            <option value="site_engineer">Vikram (Site Eng)</option>
            <option value="installer">Kiran (Installer)</option>
          </select>
        </div>

        {/* Sign Out / Switch Role Portal */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign out of current role and return to Login Portal"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden 2xl:inline font-semibold">Sign Out</span>
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={theme === 'daylight' ? 'Switch to Solar Obsidian Theme' : 'Switch to Solar Daylight Theme'}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          {theme === 'daylight' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-brand-400" />
          )}
        </button>

        {/* Search button */}
        <button
          onClick={onOpenCommandPalette}
          title="Search CRM (⌘K)"
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Tasks button */}
        <button
          onClick={onOpenTasksModal}
          title="Tasks and reminders"
          className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          {pendingTasksCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {pendingTasksCount}
            </span>
          )}
        </button>

        {/* Add Lead button (primary CTA) */}
        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Lead</span>
        </button>
      </div>

    </header>
  );
};
