import React, { useState } from 'react';
import { 
  SolarLead, 
  PipelineStage, 
  StoredDocument, 
  ActivityLog, 
  SiteSurveyData, 
  ProposalVersion,
  UserRole
} from '../types/crm';
import { PIPELINE_STAGES, TEAM_MEMBERS } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { canViewFinancials, canViewBudget } from '../utils/rbac';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Zap, 
  Building2, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Send,
  FileText,
  FileCheck,
  Compass,
  Layers,
  Upload,
  MessageSquare,
  DollarSign,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: SolarLead;
  userRole?: UserRole;
  onClose: () => void;
  onUpdateLead: (updatedLead: SolarLead) => void;
  onOpenEmailComposer: (lead: SolarLead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  userRole = 'admin',
  onClose,
  onUpdateLead,
  onOpenEmailComposer
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'survey' | 'proposals' | 'documents'>('overview');
  
  // New activity logging state
  const [actType, setActType] = useState<ActivityLog['type']>('call');
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');

  // New document upload state
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<StoredDocument['category']>('Electricity Bill');

  const isFinancialAllowed = canViewFinancials(userRole);
  const isBudgetAllowed = canViewBudget(userRole);

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      type: actType,
      author: userRole === 'admin' ? 'Sneha Patel' : userRole === 'sales' ? 'Ananya Sharma' : userRole === 'site_engineer' ? 'Vikram Rao' : 'Kiran Verma',
      role: userRole,
      title: actTitle.trim(),
      description: actDesc.trim() || 'Logged interaction',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onUpdateLead({
      ...lead,
      lastContactedDate: new Date().toISOString().slice(0, 10),
      untouchedAlert: false,
      activities: [newAct, ...lead.activities]
    });

    setActTitle('');
    setActDesc('');
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: StoredDocument = {
      id: `doc-${Date.now()}`,
      name: docName.trim().endsWith('.pdf') ? docName.trim() : `${docName.trim()}.pdf`,
      category: docCategory,
      uploadDate: new Date().toISOString().slice(0, 10),
      fileSize: '1.4 MB'
    };

    onUpdateLead({
      ...lead,
      documents: [newDoc, ...lead.documents]
    });

    setDocName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-6 transition-colors">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold border border-brand-500/20">
                {lead.id}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lead.customerName}
              </h3>
              {lead.companyOrSocietyName && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  · {lead.companyOrSocietyName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {lead.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {lead.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {lead.city}, {lead.state}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEmailComposer(lead)}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Compose Email</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progression Bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1432] flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-500 dark:text-slate-400 mr-2">Stage:</span>
            {PIPELINE_STAGES.map(stage => {
              const isCurrent = lead.stage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => onUpdateLead({ ...lead, stage: stage.id })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {stage.shortLabel}
                </button>
              );
            })}
          </div>

          <div className="text-slate-500 dark:text-slate-400 font-mono text-[12px] whitespace-nowrap">
            Assigned: <strong className="text-slate-800 dark:text-slate-200">{lead.assignedTo}</strong>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e1432] flex items-center gap-4 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            System & Engineering Overview
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'activities' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Activity Log ({lead.activities.length})
          </button>
          <button
            onClick={() => setActiveTab('survey')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'survey' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Site Survey & Shading
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'proposals' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Proposals ({lead.proposals.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'documents' ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Document Vault ({lead.documents.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-900 dark:text-slate-100">
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Recommended Plant */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 block">Recommended Plant</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {lead.recommendedCapacityKw} <span className="text-xs font-sans text-slate-500">kWp</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{lead.roofType}</span>
                </div>

                {/* Monthly Power Bill */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 block">Monthly Power Bill</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    {formatINR(lead.monthlyBill)}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">~{Math.round(lead.monthlyBill / 8.5)} units/mo</span>
                </div>

                {/* Customer Budget (Role-Masked) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 block">Customer Budget</span>
                  {isBudgetAllowed ? (
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {lead.customerBudget ? formatINR(lead.customerBudget) : 'Flexible'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500 font-mono text-xs mt-1">
                      <Lock className="w-3 h-3" />
                      <span>₹ •••••• (Role Masked)</span>
                    </div>
                  )}
                  <span className="text-[11px] text-slate-500 block mt-1">Stated budget ceiling</span>
                </div>

                {/* Net Investment (Role-Masked) */}
                <div className="p-4 bg-brand-500/10 dark:bg-brand-950/30 rounded-xl border border-brand-500/30">
                  <span className="text-[12px] text-brand-700 dark:text-brand-400 block font-bold">Turnkey Net Investment</span>
                  {isFinancialAllowed ? (
                    <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {formatINR(lead.netPayableAmount || lead.estimatedQuoteValue)}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-slate-500 font-mono text-xs mt-1">
                      <Lock className="w-3 h-3 text-brand-500" />
                      <span>₹ •••••• (Role Masked)</span>
                    </div>
                  )}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                    {isFinancialAllowed && lead.estimatedSubsidyAmount > 0 
                      ? `After ₹${lead.estimatedSubsidyAmount.toLocaleString()} PM Surya Ghar Subsidy` 
                      : 'Commercial Pricing'}
                  </span>
                </div>
              </div>

              {/* Site Details */}
              <div className="p-4 bg-white dark:bg-[#101839] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[12px] font-mono">
                  Site Address & Consumer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 text-[12px] block">Installation Site Address</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{lead.address}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[12px] block">DISCOM / Consumer Number</span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                      {lead.subsidyTracker?.consumerNumber || 'Not submitted'} ({lead.subsidyTracker?.discomName || 'DISCOM'})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-5 text-xs">
              {/* Log new activity */}
              <form onSubmit={handleLogActivity} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Log Customer Interaction</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Interaction Channel</label>
                    <select
                      value={actType}
                      onChange={e => setActType(e.target.value as any)}
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="call">Phone Call</option>
                      <option value="whatsapp">WhatsApp Message</option>
                      <option value="meeting">Meeting / Visit</option>
                      <option value="note">Internal Engineering Note</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-slate-600 dark:text-slate-400 block mb-1">Subject / Summary *</label>
                    <input
                      type="text"
                      required
                      value={actTitle}
                      onChange={e => setActTitle(e.target.value)}
                      placeholder="e.g. Discussed 10kWp proposal with client..."
                      className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Log Entry
                </button>
              </form>

              {/* History list */}
              <div className="space-y-3">
                {lead.activities.map(act => (
                  <div key={act.id} className="p-3 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{act.title}</span>
                      <span className="font-mono text-slate-500 text-[11px]">{act.timestamp}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[12px]">{act.description}</p>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Logged by {act.author} ({act.role})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">Survey & Structural Profile</h4>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {lead.siteSurvey?.status || 'Scheduled'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                  <div>
                    <span className="text-slate-500 block">Survey Date:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{lead.siteSurvey?.scheduledDate || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Shading Profile:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{lead.siteSurvey?.shadingAssessment || 'Nil (0-2%)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tilt & Azimuth:</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{lead.siteSurvey?.tiltAngleDeg || 14}° / {lead.siteSurvey?.azimuthAngleDeg || 180}° S</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Meter Connection:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{lead.siteSurvey?.meterType || 'Three Phase LT'}</span>
                  </div>
                </div>
                {lead.siteSurvey?.notes && (
                  <p className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic">
                    "{lead.siteSurvey.notes}"
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="space-y-3 text-xs">
              {lead.proposals.length === 0 ? (
                <p className="text-slate-500 italic">No proposals issued yet.</p>
              ) : (
                lead.proposals.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{p.versionNumber} — {p.systemSizeKw} kWp</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{p.status} ({p.openedCount} opens)</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[12px]">{p.panelBrand} · {p.inverterBrand}</p>
                    <div className="flex items-center justify-between pt-1 font-mono text-[12px]">
                      {isFinancialAllowed ? (
                        <>
                          <span>Net: {formatINR(p.netPrice)}</span>
                          <span>Payback: {p.paybackYears} years</span>
                        </>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Lock className="w-3 h-3" />
                          <span>Commercial quote details masked for technical profile</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4 text-xs">
              {/* Upload document */}
              <form onSubmit={handleUploadDocument} className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="Document Name (e.g. Aadhaar Card, Net Meter NOC)..."
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as any)}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Electricity Bill">Electricity Bill</option>
                  <option value="Aadhaar / ID">Aadhaar / ID</option>
                  <option value="DISCOM Sanction">DISCOM Sanction</option>
                  <option value="Agreement">EPC Agreement</option>
                  <option value="Invoice">Invoice</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save Document
                </button>
              </form>

              <div className="space-y-2">
                {lead.documents.map(doc => (
                  <div key={doc.id} className="p-3 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{doc.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{doc.category} · {doc.uploadDate}</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {doc.fileSize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
