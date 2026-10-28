import React, { useState, useMemo } from 'react';
import { SolarLead, PropertyType, PipelineStage, LeadSource, UserRole } from '../types/crm';
import { PIPELINE_STAGES, TEAM_MEMBERS } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { canViewFinancials, canViewBudget } from '../utils/rbac';
import { 
  Search, 
  Download, 
  Plus, 
  Mail, 
  ExternalLink, 
  Home, 
  Building2, 
  Factory, 
  Tractor,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface LeadsViewProps {
  leads: SolarLead[];
  userRole?: UserRole;
  assignedOnlyFilter?: boolean;
  onSelectLead: (lead: SolarLead) => void;
  onOpenEmailComposer: (lead: SolarLead) => void;
  onOpenNewLead: () => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage) => void;
  onOpenRoleMatrix?: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  userRole = 'admin',
  assignedOnlyFilter = false,
  onSelectLead,
  onOpenEmailComposer,
  onOpenNewLead,
  onUpdateLeadStage,
  onOpenRoleMatrix
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropType, setSelectedPropType] = useState<PropertyType | 'all'>('all');
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<LeadSource | 'all'>('all');
  const [selectedRep, setSelectedRep] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'capacity'>('date');

  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        if (selectedPropType !== 'all' && lead.propertyType !== selectedPropType) return false;
        if (selectedStage !== 'all' && lead.stage !== selectedStage) return false;
        if (selectedSource !== 'all' && lead.source !== selectedSource) return false;
        if (selectedRep !== 'all' && lead.assignedTo !== selectedRep) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = lead.customerName.toLowerCase().includes(q);
          const matchCompany = lead.companyOrSocietyName?.toLowerCase().includes(q);
          const matchCity = lead.city.toLowerCase().includes(q);
          const matchPhone = lead.phone.includes(q);
          const matchEmail = lead.email.toLowerCase().includes(q);
          return matchName || matchCompany || matchCity || matchPhone || matchEmail;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'value') {
          return (b.netPayableAmount || b.estimatedQuoteValue) - (a.netPayableAmount || a.estimatedQuoteValue);
        }
        if (sortBy === 'capacity') {
          return b.recommendedCapacityKw - a.recommendedCapacityKw;
        }
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });
  }, [leads, selectedPropType, selectedStage, selectedSource, selectedRep, searchQuery, sortBy]);

  const handleExportCSV = () => {
    const isFinancialVisible = canViewFinancials(userRole);
    const headers = [
      'Lead ID',
      'Customer Name',
      'Company/Society',
      'Phone',
      'Email',
      'City',
      'Property Type',
      'Capacity (kWp)',
      'Monthly Bill (INR)',
      'Customer Budget (INR)',
      'Net Price (INR)',
      'Stage',
      'Source',
      'Assigned To',
      'Next Follow-Up'
    ];

    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.customerName}"`,
      `"${l.companyOrSocietyName || ''}"`,
      l.phone,
      l.email,
      l.city,
      `"${l.propertyType}"`,
      l.recommendedCapacityKw,
      l.monthlyBill,
      isFinancialVisible ? (l.customerBudget || 'N/A') : '"MASKED_ROLE_RESTRICTED"',
      isFinancialVisible ? (l.netPayableAmount || l.estimatedQuoteValue) : '"MASKED_ROLE_RESTRICTED"',
      `"${l.stage}"`,
      `"${l.source}"`,
      `"${l.assignedTo}"`,
      l.nextFollowUpDate || 'None'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solarqube_leads_${userRole}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPropIcon = (propType: PropertyType) => {
    switch (propType) {
      case 'Home / Villa':
        return <Home className="w-3.5 h-3.5 text-brand-500" />;
      case 'Commercial / Office':
        return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
      case 'Factory / Industrial Shed':
        return <Factory className="w-3.5 h-3.5 text-purple-500" />;
      case 'Farm / Agricultural Pump':
        return <Tractor className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Customer Leads & Site Records
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {filteredLeads.length} leads
            </span>
            {assignedOnlyFilter && (
              <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-bold">
                Filtered: My Assigned Only
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Omni-channel solar lead intake from website forms, WhatsApp, calls, expos, ads, and referral networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenRoleMatrix && (
            <button
              onClick={onOpenRoleMatrix}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span className="hidden md:inline">Data Visibility Matrix</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewLead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="p-4 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, city, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          {/* Stage Dropdown */}
          <div>
            <select
              value={selectedStage}
              onChange={e => setSelectedStage(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Stages ({leads.length})</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div>
            <select
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Inbound Sources</option>
              <option value="Website Form">Website Form</option>
              <option value="WhatsApp Inbound">WhatsApp Inbound</option>
              <option value="Phone Call">Phone Call</option>
              <option value="Expo & Event">Expo & Event</option>
              <option value="Customer Referral">Customer Referral</option>
              <option value="Facebook Ad">Facebook Ad</option>
              <option value="Google Ad">Google Ad</option>
              <option value="Field Survey">Field Survey</option>
            </select>
          </div>

          {/* Rep Dropdown */}
          <div>
            <select
              value={selectedRep}
              onChange={e => setSelectedRep(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Team Reps</option>
              {TEAM_MEMBERS.map(m => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Property Type Segmented Filter & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setSelectedPropType('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPropType === 'all' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setSelectedPropType('Home / Villa')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPropType === 'Home / Villa' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Home / Villa
            </button>
            <button
              onClick={() => setSelectedPropType('Commercial / Office')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPropType === 'Commercial / Office' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Commercial
            </button>
            <button
              onClick={() => setSelectedPropType('Factory / Industrial Shed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPropType === 'Factory / Industrial Shed' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Factory / Industrial
            </button>
            <button
              onClick={() => setSelectedPropType('Farm / Agricultural Pump')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedPropType === 'Farm / Agricultural Pump' 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Farm / Agri Pump
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="date">Date Added</option>
              <option value="value">Deal Value</option>
              <option value="capacity">kWp Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* High-Density Modern Table */}
      <div className="bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Customer & Site Location</th>
                <th className="py-3.5 px-4">Capacity & Bill</th>
                <th className="py-3.5 px-4 text-right">Net Price / Budget</th>
                <th className="py-3.5 px-4">Pipeline Stage</th>
                <th className="py-3.5 px-4">Source & Rep</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No customer leads match the current filters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectLead(lead)}
                  >
                    {/* Customer & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {getPropIcon(lead.propertyType)}
                        <span>{lead.customerName}</span>
                        {lead.companyOrSocietyName && (
                          <span className="text-[12px] font-normal text-slate-500 dark:text-slate-400 font-sans">
                            ({lead.companyOrSocietyName})
                          </span>
                        )}
                        {lead.untouchedAlert && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Untouched > 48h" />
                        )}
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{lead.propertyType}</span>
                        <span aria-hidden="true">·</span>
                        <span>{lead.city}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{lead.phone}</span>
                      </div>
                    </td>

                    {/* Capacity & Bill */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {lead.recommendedCapacityKw} <span className="text-[12px] font-sans font-normal text-slate-500">kWp</span>
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Bill: {formatINR(lead.monthlyBill)}/mo
                      </div>
                    </td>

                    {/* Net Price & Customer Budget (Masked if non-financial role) */}
                    <td className="py-3.5 px-4 text-right">
                      {canViewFinancials(userRole) ? (
                        <>
                          <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                            {formatINR(lead.netPayableAmount || lead.estimatedQuoteValue)}
                          </div>
                          {lead.customerBudget && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              Budget: {formatINR(lead.customerBudget)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[12px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>₹ •••••• (Role Masked)</span>
                        </div>
                      )}
                    </td>

                    {/* Pipeline Stage Quick Switcher */}
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.stage}
                        onChange={e => onUpdateLeadStage(lead.id, e.target.value as PipelineStage)}
                        className={`text-[12px] font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                          lead.stage === 'won'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : lead.stage === 'lost'
                            ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : lead.stage === 'new'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-brand-50 text-brand-800 border-brand-300 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800'
                        }`}
                      >
                        {PIPELINE_STAGES.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Source & Assigned Rep */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {lead.source}
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                        <UserCheck className="w-3 h-3 text-slate-500" />
                        <span>{lead.assignedTo}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenEmailComposer(lead)}
                          title="Send follow-up email"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectLead(lead)}
                          title="Open detailed dossier"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
