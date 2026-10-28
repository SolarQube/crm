import React, { useState } from 'react';
import { SolarLead, ServiceTicket, CustomerReferral } from '../types/crm';
import { INITIAL_SERVICE_TICKETS, INITIAL_REFERRALS } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { 
  Wrench, 
  Gift, 
  Star, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertTriangle, 
  ShieldCheck, 
  Share2, 
  Phone
} from 'lucide-react';

interface AfterSalesModuleProps {
  leads: SolarLead[];
}

export const AfterSalesModule: React.FC<AfterSalesModuleProps> = ({ leads }) => {
  const [activeTab, setActiveTab] = useState<'service' | 'referrals'>('service');
  const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>(INITIAL_SERVICE_TICKETS);
  const [referrals, setReferrals] = useState<CustomerReferral[]>(INITIAL_REFERRALS);

  // New ticket modal state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [issueCategory, setIssueCategory] = useState<ServiceTicket['issueCategory']>('Panel Cleaning Due');
  const [ticketPriority, setTicketPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [ticketNotes, setTicketNotes] = useState('');

  // New referral modal state
  const [showNewReferralModal, setShowNewReferralModal] = useState(false);
  const [referrerLeadId, setReferrerLeadId] = useState(leads[0]?.id || '');
  const [refereeName, setRefereeName] = useState('');
  const [refereePhone, setRefereePhone] = useState('');
  const [refereeKw, setRefereeKw] = useState(8);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    const newT: ServiceTicket = {
      id: `tkt-${Date.now()}`,
      leadId: lead.id,
      customerName: lead.customerName,
      systemSizeKw: lead.recommendedCapacityKw,
      issueCategory,
      priority: ticketPriority,
      status: 'Open',
      createdDate: new Date().toISOString().slice(0, 10),
      assignedEngineer: 'Kiran Verma',
      notes: ticketNotes.trim() || 'Ticket logged from customer desk',
      warrantyPanelStatus: 'Valid (25-Yr Linear)',
      warrantyInverterStatus: 'Valid (5-Yr)'
    };

    setServiceTickets([newT, ...serviceTickets]);
    setShowNewTicketModal(false);
    setTicketNotes('');
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const referrer = leads.find(l => l.id === referrerLeadId);
    if (!referrer || !refereeName.trim()) return;

    const newR: CustomerReferral = {
      id: `ref-${Date.now()}`,
      referrerLeadId: referrer.id,
      referrerName: referrer.customerName,
      referredCustomerName: refereeName.trim(),
      referredPhone: refereePhone.trim() || '+91 98000 00000',
      systemSizeKw: refereeKw,
      status: 'In Discussion',
      incentiveAmount: refereeKw >= 10 ? 15000 : 7500
    };

    setReferrals([newR, ...referrals]);
    setShowNewReferralModal(false);
    setRefereeName('');
    setRefereePhone('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            After-Sales Service, AMC & Customer Referrals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Maintain high generation yields with warranty tracking and harness happy customers as your #1 solar lead channel
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'service' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Service Tickets & AMC ({serviceTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'referrals' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Referrals & Reviews ({referrals.length})
          </button>
        </div>
      </div>

      {activeTab === 'service' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Active Plant Maintenance & Complaints
            </span>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>Log Service Ticket</span>
            </button>
          </div>

          <div className="space-y-3">
            {serviceTickets.map(tkt => (
              <div
                key={tkt.id}
                className="p-4 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{tkt.customerName}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">({tkt.systemSizeKw} kWp)</span>
                    <span className="text-slate-500 dark:text-slate-400">·</span>
                    <span className="text-rose-700 dark:text-rose-300 font-medium">{tkt.issueCategory}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[12px]">{tkt.notes}</p>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[12px] font-mono">
                    <span>Logged: {tkt.createdDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>Assigned: {tkt.assignedEngineer}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-300">Panel Warranty: {tkt.warrantyPanelStatus}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-[12px] font-mono ${
                    tkt.status === 'Resolved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300'
                  }`}>
                    {tkt.status}
                  </span>
                  {tkt.status !== 'Resolved' && (
                    <button
                      onClick={() =>
                        setServiceTickets(
                          serviceTickets.map(x => (x.id === tkt.id ? { ...x, status: 'Resolved' } : x))
                        )
                      }
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-800 dark:text-slate-100 font-medium"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Customer Referral Program & Cash Bonuses
            </span>
            <button
              onClick={() => setShowNewReferralModal(true)}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>Record Customer Referral</span>
            </button>
          </div>

          <div className="space-y-3">
            {referrals.map(ref => (
              <div
                key={ref.id}
                className="p-4 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{ref.referredCustomerName}</span>
                    <span className="text-slate-500 dark:text-slate-400">·</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">{ref.referredPhone}</span>
                    <span className="text-slate-500 dark:text-slate-400">·</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">{ref.systemSizeKw} kWp Project</span>
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    Referred by Existing Client: <strong className="text-slate-800 dark:text-slate-100">{ref.referrerName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">Referral Cashback</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                      {formatINR(ref.incentiveAmount)}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[12px] font-mono ${
                    ref.status === 'Project Won' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300'
                  }`}>
                    {ref.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Service Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1432] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Log Customer Service Request</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Select Customer</label>
                <select
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} ({l.recommendedCapacityKw} kWp)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Issue Type</label>
                <select
                  value={issueCategory}
                  onChange={e => setIssueCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Panel Cleaning Due">Panel Cleaning Due (AMC)</option>
                  <option value="Inverter Tripping">Inverter Tripping / Fault Code</option>
                  <option value="Generation Low">Generation Output Lower Than Expected</option>
                  <option value="Monitoring App Offline">Monitoring App / WiFi Logger Offline</option>
                  <option value="DISCOM Net-Meter Discrepancy">DISCOM Net-Meter Billing Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Notes / Description</label>
                <textarea
                  rows={3}
                  value={ticketNotes}
                  onChange={e => setTicketNotes(e.target.value)}
                  placeholder="Describe client observation..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-slate-900 dark:bg-brand-600 rounded font-medium"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Referral Modal */}
      {showNewReferralModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0e1432] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Happy Customer Referral</h3>
            <form onSubmit={handleCreateReferral} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Existing Customer (Referrer)</label>
                <select
                  value={referrerLeadId}
                  onChange={e => setReferrerLeadId(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} ({l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Referred Person Name *</label>
                <input
                  type="text"
                  required
                  value={refereeName}
                  onChange={e => setRefereeName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={refereePhone}
                    onChange={e => setRefereePhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Est. System (kWp)</label>
                  <input
                    type="number"
                    value={refereeKw}
                    onChange={e => setRefereeKw(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewReferralModal(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-slate-900 dark:bg-brand-600 rounded font-medium"
                >
                  Save Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
