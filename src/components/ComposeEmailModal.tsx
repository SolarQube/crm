import React, { useState, useEffect } from 'react';
import { SolarLead } from '../types/crm';
import { EmailSequence } from '../types/automation';
import { substituteEmailTokens } from '../utils/templateReplacer';
import { X, Send, Mail, Sparkles, Check, Paperclip } from 'lucide-react';

interface ComposeEmailModalProps {
  lead: SolarLead;
  sequences: EmailSequence[];
  onClose: () => void;
  onSendEmail: (leadId: string, sequenceTitle: string, subject: string, body: string) => void;
}

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  lead,
  sequences,
  onClose,
  onSendEmail
}) => {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('custom');
  const [subject, setSubject] = useState<string>(`SolarQube Turnkey Solar Proposal - ${lead.customerName} (${lead.recommendedCapacityKw} kWp)`);
  const [body, setBody] = useState<string>('');
  const [sending, setSending] = useState(false);

  // Pre-fill body on load or template change
  useEffect(() => {
    if (selectedTemplateKey === 'custom') {
      setBody(
`Dear ${lead.customerName},

Thank you for your interest in installing rooftop solar with SolarQube Energy.

Based on your current monthly electricity bill and roof area in ${lead.city}, our engineering sizing indicates that an optimal ${lead.recommendedCapacityKw} kWp system will offset over 85% of your grid consumption.

Key Highlights:
- Recommended Plant Size: ${lead.recommendedCapacityKw} kWp
- Roof Type: ${lead.roofType} (${lead.roofAreaSqFt} sq.ft)
- Estimated Annual Electricity Savings: ₹${Math.round(lead.recommendedCapacityKw * 125 * 12 * 8.5).toLocaleString()}
${lead.estimatedSubsidyAmount > 0 ? `- Central PM Surya Ghar Subsidy: ₹${lead.estimatedSubsidyAmount.toLocaleString()}` : ''}

Would you be available for a 15-minute call or physical site audit this week?

Warm regards,
Sneha Patel
Senior Solar Specialist | SolarQube Energy
sneha@solarqubeenergy.in`
      );
    } else {
      // Find step in sequences
      for (const seq of sequences) {
        for (const step of seq.steps) {
          if (`${seq.id}-${step.stepNumber}` === selectedTemplateKey) {
            setSubject(substituteEmailTokens(step.subject, lead));
            setBody(substituteEmailTokens(step.bodyTemplate, lead));
            return;
          }
        }
      }
    }
  }, [selectedTemplateKey, lead, sequences]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    setSending(true);
    setTimeout(() => {
      const templateTitle = selectedTemplateKey === 'custom' 
        ? 'Direct Solar Consultation' 
        : sequences.find(s => selectedTemplateKey.startsWith(s.id))?.title || 'Automated Follow-up';

      onSendEmail(lead.id, templateTitle, subject, body);
      setSending(false);
      onClose();
    }, 400);
  };

  const handleInsertToken = (token: string) => {
    setBody(prev => `${prev} {{${token}}}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-brand-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Compose Solar Follow-Up Email
              </h2>
              <p className="text-xs text-slate-500">
                Sender: <strong className="font-mono text-slate-700">sneha@solarqubeenergy.in</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          {/* Template Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Load Follow-Up Template / Sequence Step
            </label>
            <select
              value={selectedTemplateKey}
              onChange={e => setSelectedTemplateKey(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
            >
              <option value="custom">Standard Solar Consultation & Sizing Summary</option>
              {sequences.map(seq => (
                <optgroup key={seq.id} label={seq.title}>
                  {seq.steps.map((step: any) => (
                    <option key={`${seq.id}-${step.stepNumber}`} value={`${seq.id}-${step.stepNumber}`}>
                      {seq.title} — Step {step.stepNumber} ({step.delayLabel})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Recipient & CC info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-slate-500 block text-[12px] mb-1">To (Customer Email):</span>
              <input
                type="email"
                readOnly
                value={lead.email}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono"
              />
            </div>
            <div>
              <span className="text-slate-500 block text-[12px] mb-1">Recipient Name:</span>
              <input
                type="text"
                readOnly
                value={lead.customerName}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium"
              />
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Email Body *</label>
              <div className="flex items-center gap-1 text-[12px] text-slate-500">
                <span>Quick Tokens:</span>
                <button
                  type="button"
                  onClick={() => handleInsertToken('monthly_bill')}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono"
                >
                  Bill
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToken('system_size_kw')}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono"
                >
                  kWp
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertToken('subsidy_amount')}
                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono"
                >
                  Subsidy
                </button>
              </div>
            </div>
            <textarea
              rows={8}
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-sans text-xs leading-relaxed focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Footer & Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <span className="text-[12px] text-slate-500 font-mono">
              Auto-logged to customer activity timeline
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-brand-400" />
                <span>{sending ? 'Dispatching...' : 'Send Follow-Up'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
