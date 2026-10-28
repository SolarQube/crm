import React from 'react';
import { SolarLead, UserRole } from '../types/crm';
import { PIPELINE_STAGES } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { ROLE_PERMISSIONS, canViewFinancials, maskFinancialValue } from '../utils/rbac';
import { IMAGES } from '../assets/images';
import { 
  Zap, 
  TrendingUp, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  Share2,
  PieChart,
  UserCheck,
  AlertTriangle,
  Compass,
  Truck,
  Wrench,
  ShieldCheck,
  Layers,
  FileCheck,
  Lock,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  leads: SolarLead[];
  userRole?: UserRole;
  assignedOnlyFilter?: boolean;
  onSelectLead: (lead: SolarLead) => void;
  onOpenEmailComposer: (lead: SolarLead) => void;
  onNavigateTab: (tab: any) => void;
  onOpenRoleMatrix?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  userRole = 'admin',
  assignedOnlyFilter = false,
  onSelectLead,
  onOpenEmailComposer,
  onNavigateTab,
  onOpenRoleMatrix
}) => {
  const permissions = ROLE_PERMISSIONS[userRole];
  const activeLeads = leads.filter(l => l.stage !== 'lost');
  const wonLeads = leads.filter(l => l.stage === 'won');
  const lostLeads = leads.filter(l => l.stage === 'lost');

  // Capacity metrics (visible to all)
  const totalCapacityKw = activeLeads.reduce((sum, l) => sum + l.recommendedCapacityKw, 0);
  const totalWonCapacityKw = wonLeads.reduce((sum, l) => sum + l.recommendedCapacityKw, 0);
  const totalPanelsCount = Math.ceil((totalCapacityKw * 1000) / 550);

  // Financials (Admin & Sales only)
  const totalPipelineValue = activeLeads.reduce(
    (sum, l) => sum + (l.netPayableAmount || l.estimatedQuoteValue),
    0
  );
  const totalWonRevenue = wonLeads.reduce(
    (sum, l) => sum + (l.netPayableAmount || l.estimatedQuoteValue),
    0
  );

  // Technical metrics for Site Engineer
  const surveyedLeads = leads.filter(l => l.siteSurvey?.status === 'Completed');
  const pendingSurveyLeads = leads.filter(l => l.stage === 'site_survey' || l.stage === 'contacted');

  // Technical metrics for Installer
  const inInstallationLeads = leads.filter(l => l.stage === 'negotiation' || l.stage === 'won');
  const totalCompletedInstallStages = inInstallationLeads.reduce(
    (sum, l) => sum + l.installationSteps.filter(s => s.completed).length,
    0
  );

  const untouchedLeads = leads.filter(l => l.untouchedAlert || l.stage === 'new');
  const conversionRate = leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0;

  // Breakdown by Source (Admin & Sales)
  const sourceCounts: Record<string, number> = {};
  leads.forEach(l => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  // Breakdown by Lost Reason (Admin & Sales)
  const lostReasonsCount: Record<string, number> = {};
  lostLeads.forEach(l => {
    const r = l.lostReason || 'Other';
    lostReasonsCount[r] = (lostReasonsCount[r] || 0) + 1;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* Role Context Notification Bar with RBAC Matrix Launcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {userRole === 'admin' && 'Executive Administration Console'}
                {userRole === 'sales' && 'Sales Consultant Console'}
                {userRole === 'site_engineer' && 'Site Design Engineer Console'}
                {userRole === 'installer' && 'Lead Installation Supervisor Console'}
              </span>
              <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                {permissions.department}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              {permissions.roleDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {assignedOnlyFilter && (
            <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-mono text-[12px] font-semibold">
              Assigned Records Only
            </span>
          )}
          {onOpenRoleMatrix && (
            <button
              onClick={onOpenRoleMatrix}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
            >
              <span>Inspect Data Permissions</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* Untouched Leads Alert Banner */}
      {untouchedLeads.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <span className="font-bold">Urgent Action Required:</span>{' '}
              <span>{untouchedLeads.length} leads have not been touched within the response SLA. Solar leads drop 40% after 48h.</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('leads')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shrink-0 transition-colors cursor-pointer"
          >
            Review Inbound Queue
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CASE 1: ADMIN & SALES (Commercial & Financial Metrics) */}
        {permissions.canViewFinancials ? (
          <>
            {/* KPI 1: Pipeline Value */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Active Pipeline Value</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {formatINR(totalPipelineValue)}
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <span>{activeLeads.length} active deals</span>
                <span aria-hidden="true">·</span>
                <span>{totalCapacityKw.toLocaleString()} kWp load</span>
              </div>
            </div>

            {/* KPI 2: Won Revenue & kW Sold */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Commissioned & Sold</span>
                <Zap className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalWonCapacityKw.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-500">kWp Sold</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <span>{formatINR(totalWonRevenue)} booked</span>
                <span aria-hidden="true">·</span>
                <span>{wonLeads.length} plants energized</span>
              </div>
            </div>

            {/* KPI 3: Conversion Rate */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Win Rate (Inbound to Won)</span>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {conversionRate}%
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <span>{wonLeads.length} won</span>
                <span aria-hidden="true">·</span>
                <span>{lostLeads.length} lost recorded</span>
              </div>
            </div>

            {/* KPI 4: Solar Modules Count */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Tier-1 Modules in Scope</span>
                <PieChart className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalPanelsCount.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-500">Panels</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                550Wp Bifacial TOPCon Standard
              </div>
            </div>
          </>
        ) : userRole === 'site_engineer' ? (
          /* CASE 2: SITE ENGINEER (Technical & Feasibility Metrics - Financials Masked) */
          <>
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Surveys Completed</span>
                <Compass className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {surveyedLeads.length} <span className="text-sm font-sans font-medium text-slate-500">Audits</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                Roof CAD & shadow charts uploaded
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Pending Site Feasibilities</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {pendingSurveyLeads.length} <span className="text-sm font-sans font-medium text-slate-500">Scheduled</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                Awaiting structural inspection
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Cumulative Designed Load</span>
                <Zap className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {totalCapacityKw.toLocaleString()} <span className="text-sm font-sans font-medium text-slate-500">kWp</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                Across {activeLeads.length} customer rooftops
              </div>
            </div>

            {/* Financial Masked Notice Card */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Deal Value & P&L</span>
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                ₹ ••••••••
              </div>
              <div className="mt-2 text-xs text-brand-600 dark:text-brand-400 font-mono flex items-center gap-1">
                <span>Protected for Technical Role</span>
              </div>
            </div>
          </>
        ) : (
          /* CASE 3: INSTALLER (7-Stage Erection & Milestone Metrics - Financials Masked) */
          <>
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Active Installation Sites</span>
                <Truck className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {inInstallationLeads.length} <span className="text-sm font-sans font-medium text-slate-500">Projects</span>
              </div>
              <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                {totalCompletedInstallStages} checklist steps verified
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Commissioning Pipeline</span>
                <Zap className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {wonLeads.length} <span className="text-sm font-sans font-medium text-slate-500">Energized</span>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                DISCOM Bi-directional meter synced
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Safety & Torque Checklist</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                100%
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                Earthing pit &lt; 2 ohms verified
              </div>
            </div>

            {/* Financial Masked Notice Card */}
            <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 shadow-xs transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-semibold">Gross Contract Value</span>
                <Lock className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                ₹ ••••••••
              </div>
              <div className="mt-2 text-xs text-brand-600 dark:text-brand-400 font-mono flex items-center gap-1">
                <span>Protected for Field Crew</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Role-Adapted Content Body */}
      {permissions.canViewFinancials ? (
        /* ADMIN & SALES VIEW: Pipeline Economics, Lead Sources & Lost Reasons */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inbound Sources */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Leads by Inbound Source</h3>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{leads.length} total</span>
            </div>
            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([src, count]) => {
                const pct = Math.round((count / (leads.length || 1)) * 100);
                return (
                  <div key={src} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{src}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {count} leads ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stage Pipeline Distribution */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Stage Pipeline Distribution</h3>
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="whitespace-nowrap text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
              >
                Open Kanban →
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {PIPELINE_STAGES.map(st => {
                const count = leads.filter(l => l.stage === st.id).length;
                return (
                  <div key={st.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{st.title}</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{count} deals</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lost Reasons */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Lost-Deal Root Causes</span>
              </h3>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">{lostLeads.length} lost</span>
            </div>
            {lostLeads.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No lost deals recorded.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {Object.entries(lostReasonsCount).map(([r, cnt]) => (
                  <div key={r} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-200 flex justify-between">
                    <span className="truncate">{r}</span>
                    <span className="font-mono font-bold">{cnt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : userRole === 'site_engineer' ? (
        /* SITE ENGINEER VIEW: CAD Blueprint & Survey Execution Queue */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-500" />
              <span>3D CAD Array Feasibility Blueprint</span>
            </h3>
            <img
              src={IMAGES.technicalBlueprint}
              alt="Technical CAD"
              className="w-full h-56 object-cover rounded-xl border border-slate-200 dark:border-slate-800"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automated string spacing, tilt angle calculation (10°-14° optimal in India), and DC cable route optimization.
            </p>
            <button
              onClick={() => onNavigateTab('survey')}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Open Site Survey & Measurements Module
            </button>
          </div>

          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Site Feasibility Visits</h3>
            <div className="space-y-2.5 text-xs">
              {leads.slice(0, 3).map(lead => (
                <div key={lead.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{lead.customerName}</span>
                    <span className="font-mono text-brand-600 dark:text-brand-400">{lead.recommendedCapacityKw} kWp</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[12px]">{lead.address}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono pt-1">
                    <span>Roof: {lead.roofType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Meter: {lead.siteSurvey?.meterType || 'Three Phase LT'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* INSTALLER VIEW: 7-Stage Installation Checklist & Warehouse BOS */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-500" />
              <span>Installation Dispatch Queue</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              7-stage technical execution: Structure bolting, module torquing, DC earthing, and DISCOM synchronization.
            </p>
            <button
              onClick={() => onNavigateTab('delivery')}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Open Installation Checklist & Photo Upload
            </button>
          </div>

          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Site Tasks</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Anil Bansal Residence (15 kWp)</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[12px]">DISCOM Net-Meter energized</span>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% DONE</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Dr. Arvind Rao Villa (10 kWp)</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[12px]">Awaiting structure procurement</span>
                </div>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">STAGE 1</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
