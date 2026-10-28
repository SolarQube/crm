import React from 'react';
import { IMAGES } from '../assets/images';
import { UserRole } from '../types/crm';
import { TEAM_MEMBERS } from '../data/initialData';
import { 
  Plus, 
  Calendar, 
  Globe, 
  Database, 
  AlertCircle, 
  ShieldCheck, 
  User, 
  Sun,
  Layers,
  Wrench,
  FileText,
  Truck
} from 'lucide-react';

export type MainNavTab = 
  | 'dashboard' 
  | 'leads' 
  | 'pipeline' 
  | 'survey' 
  | 'quotations' 
  | 'delivery' 
  | 'aftersales' 
  | 'automations' 
  | 'calculator';

interface HeaderProps {
  currentTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  onOpenNewLead: () => void;
  onOpenTasksModal: () => void;
  onOpenWebsiteForm: () => void;
  onOpenImportExport: () => void;
  leadsCount: number;
  pendingTasksCount: number;
  untouchedAlertCount: number;
  userRole: UserRole;
  onChangeUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewLead,
  onOpenTasksModal,
  onOpenWebsiteForm,
  onOpenImportExport,
  leadsCount,
  pendingTasksCount,
  untouchedAlertCount,
  userRole,
  onChangeUserRole
}) => {
  const currentMember = TEAM_MEMBERS.find(m => m.role === userRole) || TEAM_MEMBERS[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center whitespace-nowrap shrink-0">
            <img
              src={IMAGES.logo}
              alt="SolarQube Energy"
              referrerPolicy="no-referrer"
              className="h-9 w-auto select-none"
              draggable={false}
            />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('leads')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentTab === 'leads'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Leads
              <span className="text-[12px] font-mono text-slate-500">({leadsCount})</span>
            </button>
            <button
              onClick={() => onTabChange('pipeline')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'pipeline'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => onTabChange('survey')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'survey'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Site Survey
            </button>
            <button
              onClick={() => onTabChange('quotations')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'quotations'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Quotations
            </button>
            <button
              onClick={() => onTabChange('delivery')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'delivery'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Delivery & Inventory
            </button>
            <button
              onClick={() => onTabChange('aftersales')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'aftersales'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              After-Sales & AMC
            </button>
            <button
              onClick={() => onTabChange('automations')}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentTab === 'automations'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Automations & WA
              {untouchedAlertCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              )}
            </button>
          </nav>

          {/* Zone 3: Role Selector, Reminders & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
              <span className="text-slate-500 text-[12px] font-mono hidden sm:inline">Role:</span>
              <select
                value={userRole}
                onChange={e => onChangeUserRole(e.target.value as UserRole)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer capitalize"
              >
                <option value="admin">Admin (Sneha)</option>
                <option value="sales">Sales (Ananya)</option>
                <option value="site_engineer">Site Engineer (Vikram)</option>
                <option value="installer">Installer (Kiran)</option>
              </select>
            </div>

            {/* Follow-up tasks button */}
            <button
              onClick={onOpenTasksModal}
              title="Follow-up tasks and reminders"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              {pendingTasksCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white rounded-full text-[11px] font-mono font-bold flex items-center justify-center">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Website form preview */}
            <button
              onClick={onOpenWebsiteForm}
              title="Preview Public Website Lead Capture Form"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline font-medium">Website Form</span>
            </button>

            {/* Data & Backup */}
            <button
              onClick={onOpenImportExport}
              title="Import/Export CSV & Database Backup"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewLead}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 rounded-lg hover:bg-slate-800 dark:hover:bg-brand-700 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>+ New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar with horizontal scrolling for site teams */}
      <div className="xl:hidden flex items-center gap-1 px-3 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'dashboard' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onTabChange('leads')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'leads' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Leads ({leadsCount})
        </button>
        <button
          onClick={() => onTabChange('pipeline')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'pipeline' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Pipeline
        </button>
        <button
          onClick={() => onTabChange('survey')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'survey' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Site Survey
        </button>
        <button
          onClick={() => onTabChange('quotations')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'quotations' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Quotations
        </button>
        <button
          onClick={() => onTabChange('delivery')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'delivery' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Delivery
        </button>
        <button
          onClick={() => onTabChange('aftersales')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'aftersales' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          After-Sales
        </button>
        <button
          onClick={() => onTabChange('automations')}
          className={`px-2 py-1 rounded whitespace-nowrap ${currentTab === 'automations' ? 'font-bold bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
        >
          Automations
        </button>
      </div>
    </header>
  );
};
