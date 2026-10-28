import React, { useState } from 'react';
import { EmailSequence, EmailStep } from '../types/automation';
import { SolarLead } from '../types/crm';
import { substituteEmailTokens } from '../utils/templateReplacer';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  Sliders, 
  Layers, 
  Eye, 
  Sparkles,
  ArrowRight,
  Check,
  UserCheck
} from 'lucide-react';

interface AutomationsViewProps {
  sequences: EmailSequence[];
  leads: SolarLead[];
  onToggleSequence: (sequenceId: string) => void;
  onSendAutomatedEmail: (leadId: string, sequenceTitle: string, subject: string, body: string) => void;
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  sequences,
  leads,
  onToggleSequence,
  onSendAutomatedEmail
}) => {
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(sequences[0]?.id || '');
  const [simulatedLeadId, setSimulatedLeadId] = useState<string>(leads[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'sequences' | 'outbox'>('sequences');
  const [sendSuccessMsg, setSendSuccessMsg] = useState<string | null>(null);

  const selectedSeq = sequences.find(s => s.id === selectedSequenceId) || sequences[0];
  const simulatedLead = leads.find(l => l.id === simulatedLeadId) || leads[0];

  // All dispatched emails across all leads
  const allDispatchedEmails = leads.flatMap(lead => 
    (lead.emailHistory || []).map((em: any) => ({
      ...em,
      customerName: lead.customerName,
      leadId: lead.id
    }))
  ).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const handleTriggerSimulatedSend = (step: EmailStep) => {
    if (!simulatedLead || !selectedSeq) return;
    const finalSubject = substituteEmailTokens(step.subject, simulatedLead);
    const finalBody = substituteEmailTokens(step.bodyTemplate, simulatedLead);

    onSendAutomatedEmail(simulatedLead.id, selectedSeq.title, finalSubject, finalBody);
    setSendSuccessMsg(`Successfully dispatched Step ${step.stepNumber} to ${simulatedLead.email}`);
    setTimeout(() => setSendSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Automated Follow-Up Sequences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent drip campaigns and milestone emails personalized with solar capacity, ROI math, and DISCOM updates
          </p>
        </div>

        {/* View Switcher: Sequences vs Outbox */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('sequences')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'sequences'
                ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Sequence Workflows ({sequences.length})
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'outbox'
                ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Sent Outbox & Delivery ({allDispatchedEmails.length})
          </button>
        </div>
      </div>

      {sendSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{sendSuccessMsg}</span>
          </div>
          <button onClick={() => setSendSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 font-bold">
            ×
          </button>
        </div>
      )}

      {activeTab === 'sequences' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (4 cols): Sequence List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Active Trigger Sequences
            </div>

            <div className="space-y-2">
              {sequences.map(seq => {
                const isSelected = seq.id === selectedSequenceId;

                return (
                  <div
                    key={seq.id}
                    onClick={() => setSelectedSequenceId(seq.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
                        ? 'bg-white dark:bg-[#0e1432] border-brand-400 shadow-xs ring-1 ring-brand-400/20'
                        : 'bg-white dark:bg-[#0e1432] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {seq.title}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleSequence(seq.id);
                        }}
                        title={seq.active ? 'Pause automation' : 'Activate automation'}
                        className={`p-1 rounded text-xs transition-colors ${
                          seq.active
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100'
                            : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {seq.active ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {seq.description}
                    </p>

                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>{seq.steps.length} {seq.steps.length === 1 ? 'step' : 'steps'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{seq.enrollCount} leads</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">{seq.openRatePercent}% open</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (8 cols): Step Sequence Inspector & Live Lead Simulator */}
          <div className="lg:col-span-8 space-y-6">
            {selectedSeq && (
              <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
                {/* Sequence Overview Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedSeq.title}
                      </h2>
                      <span className={`text-[12px] font-mono px-2 py-0.5 rounded ${selectedSeq.active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {selectedSeq.active ? 'ACTIVE DRIP' : 'PAUSED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Trigger Event: <strong className="text-slate-700 dark:text-slate-200 font-mono">{selectedSeq.triggerEvent}</strong>
                    </p>
                  </div>

                  {/* Simulator Lead Picker */}
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Preview with Lead:</span>
                    <select
                      value={simulatedLeadId}
                      onChange={e => setSimulatedLeadId(e.target.value)}
                      className="text-xs bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-900 dark:text-white font-medium"
                    >
                      {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.customerName} ({lead.recommendedCapacityKw} kWp)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-4">
                  {selectedSeq.steps.map((step: EmailStep) => {
                    const previewSubject = simulatedLead
                      ? substituteEmailTokens(step.subject, simulatedLead)
                      : step.subject;
                    const previewBody = simulatedLead
                      ? substituteEmailTokens(step.bodyTemplate, simulatedLead)
                      : step.bodyTemplate;

                    return (
                      <div
                        key={step.stepNumber}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 space-y-3"
                      >
                        {/* Step Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-[#0a0f2a] dark:border dark:border-slate-700 text-brand-400 text-xs font-mono font-bold flex items-center justify-center">
                              {step.stepNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Step {step.stepNumber}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                              {step.delayLabel}
                            </span>
                          </div>

                          <button
                            onClick={() => handleTriggerSimulatedSend(step)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Send className="w-3 h-3 text-brand-400" />
                            <span>Dispatch to {simulatedLead?.customerName?.split(' ')[0]}</span>
                          </button>
                        </div>

                        {/* Subject Line Preview */}
                        <div className="bg-white dark:bg-[#0e1432] p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[12px] block">SUBJECT LINE:</span>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {previewSubject}
                          </p>
                        </div>

                        {/* Body Preview */}
                        <div className="bg-white dark:bg-[#0e1432] p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[12px]">
                            <span>RENDERED EMAIL BODY (FROM: sneha@solarqubeenergy.in):</span>
                            <span>Tokens Substituted</span>
                          </div>
                          <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                            {previewBody}
                          </pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Sent Outbox & Delivery Tab */
        <div className="bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Dispatched Solar Email Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time tracking of automated drip sequences, delivery confirmations, and client opens
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              {allDispatchedEmails.length} logged dispatches
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allDispatchedEmails.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                No emails dispatched yet. Trigger an automated follow-up or compose an email.
              </div>
            ) : (
              allDispatchedEmails.map(em => (
                <div key={em.id} className="p-4 hover:bg-slate-50/60 transition-colors space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {em.customerName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        ({em.recipient})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {em.status}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        {em.sentAt}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-100">
                    {em.subject}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                    {em.snippet}
                  </p>

                  {em.sequenceTitle && (
                    <div className="text-[12px] text-brand-700 dark:text-brand-300 font-mono">
                      Workflow: {em.sequenceTitle}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
