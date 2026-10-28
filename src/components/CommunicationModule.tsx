import React, { useState } from 'react';
import { SolarLead } from '../types/crm';
import { WhatsAppTemplate, AutoAssignmentRule } from '../types/automation';
import { INITIAL_WHATSAPP_TEMPLATES, INITIAL_ASSIGNMENT_RULES, TEAM_MEMBERS } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  Sliders, 
  UserPlus, 
  ExternalLink,
  Check
} from 'lucide-react';

interface CommunicationModuleProps {
  leads: SolarLead[];
  onTriggerWhatsAppLog: (leadId: string, templateName: string, text: string) => void;
}

export const CommunicationModule: React.FC<CommunicationModuleProps> = ({
  leads,
  onTriggerWhatsAppLog
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'assignment' | 'untouched'>('whatsapp');
  const [waTemplates, setWaTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);
  const [assignmentRules, setAssignmentRules] = useState<AutoAssignmentRule[]>(INITIAL_ASSIGNMENT_RULES);
  
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(waTemplates[0]?.id || '');
  const [toast, setToast] = useState<string | null>(null);

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const activeTemplate = waTemplates.find(t => t.id === selectedTemplateId) || waTemplates[0];

  // Substitute variables for preview
  const getRenderedWhatsAppMessage = () => {
    if (!activeLead || !activeTemplate) return '';
    let text = activeTemplate.content;
    const monthlyUnits = Math.round(activeLead.recommendedCapacityKw * 125);
    const annualSavings = Math.round(monthlyUnits * 12 * 8.5);

    text = text.replace(/{{customer_name}}/g, activeLead.customerName);
    text = text.replace(/{{monthly_bill}}/g, formatINR(activeLead.monthlyBill));
    text = text.replace(/{{system_size_kw}}/g, activeLead.recommendedCapacityKw.toString());
    text = text.replace(/{{monthly_units}}/g, monthlyUnits.toLocaleString());
    text = text.replace(/{{engineer_name}}/g, activeLead.assignedTo || 'Vikram Rao');
    text = text.replace(/{{address}}/g, activeLead.city);
    text = text.replace(/{{visit_date}}/g, activeLead.nextFollowUpDate || 'Tomorrow 11 AM');
    text = text.replace(/{{gross_cost}}/g, formatINR(activeLead.estimatedQuoteValue));
    text = text.replace(/{{subsidy_amount}}/g, formatINR(activeLead.estimatedSubsidyAmount));
    text = text.replace(/{{net_cost}}/g, formatINR(activeLead.netPayableAmount || activeLead.estimatedQuoteValue));
    text = text.replace(/{{payback_years}}/g, '3.8');
    text = text.replace(/{{proposal_url}}/g, `https://solarqube.in/p/${activeLead.id}`);
    text = text.replace(/{{discom_name}}/g, activeLead.subsidyTracker?.discomName || 'BESCOM');
    text = text.replace(/{{sanction_number}}/g, activeLead.subsidyTracker?.sanctionLetterNumber || 'SANCTION/2026/89');
    return text;
  };

  const handleSendWhatsApp = () => {
    if (!activeLead) return;
    const rendered = getRenderedWhatsAppMessage();
    const cleanPhone = activeLead.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rendered)}`;

    // Open WhatsApp Web or mobile app
    window.open(waUrl, '_blank');

    onTriggerWhatsAppLog(activeLead.id, activeTemplate.name, rendered);
    setToast(`Dispatched WhatsApp template "${activeTemplate.name}" to ${activeLead.customerName}`);
    setTimeout(() => setToast(null), 4000);
  };

  // Untouched leads (> 48 hours without contact)
  const untouchedLeads = leads.filter(l => l.untouchedAlert || l.stage === 'new');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Omni-Channel Communication & Automation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            WhatsApp click-to-chat triggers, automated round-robin lead distribution, and untouched lead alerts
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'whatsapp' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            WhatsApp Templates
          </button>
          <button
            onClick={() => setActiveTab('assignment')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'assignment' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Auto Lead Assignment
          </button>
          <button
            onClick={() => setActiveTab('untouched')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'untouched' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Untouched Alerts</span>
            {untouchedLeads.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* WhatsApp tab */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Templates list (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Pre-Approved Solar Templates
            </span>
            <div className="space-y-2">
              {waTemplates.map(tpl => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tpl.id === selectedTemplateId
                      ? 'bg-white dark:bg-[#0e1432] border-brand-400 shadow-xs ring-1 ring-brand-400/20'
                      : 'bg-white dark:bg-[#0e1432] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{tpl.name}</span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {tpl.triggerCategory}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {tpl.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Message preview and trigger (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Live WhatsApp Dispatch Simulator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sends directly via WhatsApp Web / API with dynamic values substituted
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Select Customer:</span>
                  <select
                    value={selectedLeadId}
                    onChange={e => setSelectedLeadId(e.target.value)}
                    className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-medium text-slate-900 dark:text-white"
                  >
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.customerName} ({l.phone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="p-4 bg-emerald-950/5 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[12px] text-emerald-800 dark:text-emerald-300 font-mono">
                  <span>RECIPIENT: {activeLead?.phone} ({activeLead?.customerName})</span>
                  <span>PREVIEW</span>
                </div>
                <div className="bg-white dark:bg-[#0e1432] p-3.5 rounded-lg border border-emerald-200/60 shadow-xs text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans whitespace-pre-wrap">
                  {getRenderedWhatsAppMessage()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[12px] text-slate-500 dark:text-slate-400 font-mono">
                  Also recorded to Lead Activity Timeline
                </span>

                <button
                  onClick={handleSendWhatsApp}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Launch WhatsApp & Dispatch</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Assignment Rules */}
      {activeTab === 'assignment' && (
        <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated Lead Distribution Rules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Eliminates lead response lag by assigning inbound web/WhatsApp leads instantly to available sales reps
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {assignmentRules.map(rule => (
              <div
                key={rule.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{rule.name}</span>
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono rounded text-[12px]">
                      {rule.strategy}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Active Reps: {rule.assignedReps.join(', ')}
                  </p>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold font-mono rounded text-[12px]">
                  ENABLED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Untouched lead alerts */}
      {activeTab === 'untouched' && (
        <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Untouched Lead Watchlist (&gt; 48 Hours)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Leads requiring immediate telephone outreach or site visit booking before they cool off
              </p>
            </div>
            <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold">
              {untouchedLeads.length} leads flagged
            </span>
          </div>

          <div className="space-y-3">
            {untouchedLeads.map(l => (
              <div
                key={l.id}
                className="p-4 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{l.customerName}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">({l.recommendedCapacityKw} kWp · {l.city})</span>
                    <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-mono rounded text-[11px]">
                      Source: {l.source}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[12px]">
                    Created on {l.createdDate} · Last Contacted: {l.lastContactedDate} · Rep: {l.assignedTo}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${l.phone}`}
                    className="px-3 py-1.5 bg-white dark:bg-[#0e1432] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded font-medium hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    Call Customer
                  </a>
                  <button
                    onClick={() => {
                      setSelectedLeadId(l.id);
                      setActiveTab('whatsapp');
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                  >
                    Send WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
