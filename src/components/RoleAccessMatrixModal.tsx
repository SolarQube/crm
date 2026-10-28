import React, { useState } from 'react';
import { UserRole } from '../types/crm';
import { DATA_VISIBILITY_MATRIX, ROLE_PERMISSIONS, AccessLevel } from '../utils/rbac';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  Eye, 
  Edit3, 
  UserCheck, 
  AlertTriangle, 
  HelpCircle,
  CheckCircle2,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface RoleAccessMatrixModalProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  assignedOnlyFilter: boolean;
  onToggleAssignedOnlyFilter: (val: boolean) => void;
  onClose: () => void;
}

export const RoleAccessMatrixModal: React.FC<RoleAccessMatrixModalProps> = ({
  currentRole,
  onChangeRole,
  assignedOnlyFilter,
  onToggleAssignedOnlyFilter,
  onClose
}) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);

  const getBadgeForAccess = (level: AccessLevel) => {
    switch (level) {
      case 'full':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Full Access
          </span>
        );
      case 'view_only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Eye className="w-3 h-3" />
            View Only
          </span>
        );
      case 'assigned_only':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            <UserCheck className="w-3 h-3" />
            Assigned Only
          </span>
        );
      case 'masked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Lock className="w-3 h-3" />
            Masked (••••••)
          </span>
        );
      case 'restricted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Lock className="w-3 h-3" />
            Hidden / Locked
          </span>
        );
    }
  };

  const rolesList: UserRole[] = ['admin', 'hr', 'sales', 'project_coordinator', 'site_engineer', 'installer'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  SolarQube RBAC & Data Visibility Policy
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
                  ISO-27001 Compliant
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Role-tailored data access: Admin, HR, Sales, Project Coordinator, Site Engineers, and Installers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Quick Role Tester Pills */}
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  Test Role Simulation (6 Active Roles)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  Switch the active profile below to preview how data views adapt in real-time:
                </span>
              </div>

              {/* Assigned-only Filter Switch */}
              <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={assignedOnlyFilter}
                  onChange={e => onToggleAssignedOnlyFilter(e.target.checked)}
                  className="rounded text-brand-500 focus:ring-brand-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Filter to "My Assigned Records Only"
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {rolesList.map(r => {
                const info = ROLE_PERMISSIONS[r];
                const isActive = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => onChangeRole(r)}
                    className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-brand-500/10 border-brand-500 dark:bg-brand-400/10 dark:border-brand-400 ring-2 ring-brand-500/20'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-bold uppercase font-mono text-slate-900 dark:text-white truncate">
                        {r.replace('_', ' ')}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                      )}
                    </div>
                    <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {info.roleName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {info.department}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Answer Summary Box */}
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 text-xs text-brand-900 dark:text-brand-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-brand-800 dark:text-brand-300">
              <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span>Are all datas visible to all roles?</span>
            </div>
            <p className="leading-relaxed">
              <strong>No.</strong> Sensitive customer pricing and commercial finances are strictly restricted from <strong>HR</strong> and masked for <strong>Site Engineers & Installers</strong>. HR has complete authority over attendance, leave approvals, and payroll data, while Project Coordinators oversee installation progress and site labor hours.
            </p>
          </div>

          {/* Full Comparative Matrix Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Data Domain Access Matrix
              </span>
              <span className="text-[12px] text-slate-500 font-mono">
                {DATA_VISIBILITY_MATRIX.length} Controlled Data Categories
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 whitespace-nowrap">
                    <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 min-w-[200px]">
                      Data Domain & Description
                    </th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Admin</th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">HR</th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Sales</th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Project Coord</th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Site Eng</th>
                    <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Installer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
                  {DATA_VISIBILITY_MATRIX.map((item, idx) => (
                    <tr 
                      key={idx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.category}
                        </div>
                        <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.description}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.admin.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.admin.note}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.hr.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.hr.note}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.sales.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.sales.note}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.project_coordinator.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.project_coordinator.note}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.site_engineer.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.site_engineer.note}
                        </div>
                      </td>
                      <td className="p-3 align-top">
                        {getBadgeForAccess(item.permissions.installer.access)}
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.permissions.installer.note}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security & Audit Note */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Automated Audit Logging & Tamper Resistance
              </span>
              <p className="mt-0.5">
                Every stage change, quote revision, site survey submission, and payment recorded includes an immutable timestamp, author name, and IP record to prevent unauthorized access or modification.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Active Role: <span className="font-bold text-slate-900 dark:text-white capitalize">{currentRole.replace('_', ' ')}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Got it, Return to Workspace
          </button>
        </div>

      </div>
    </div>
  );
};
