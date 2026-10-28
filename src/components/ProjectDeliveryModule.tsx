import React, { useState } from 'react';
import { 
  SolarLead, 
  InventoryItem, 
  InstallationChecklistStep, 
  PaymentMilestone, 
  SubsidyAndNetMetering,
  UserRole 
} from '../types/crm';
import { INITIAL_INVENTORY } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { 
  Truck, 
  Layers, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Camera, 
  FileCheck, 
  AlertCircle,
  Plus,
  Boxes,
  Zap,
  Building
} from 'lucide-react';

interface ProjectDeliveryModuleProps {
  leads: SolarLead[];
  userRole: UserRole;
  onUpdateLeadInstallation: (leadId: string, steps: InstallationChecklistStep[]) => void;
  onUpdateLeadPayment: (leadId: string, payments: PaymentMilestone[]) => void;
  onUpdateLeadSubsidy: (leadId: string, subsidy: SubsidyAndNetMetering) => void;
}

export const ProjectDeliveryModule: React.FC<ProjectDeliveryModuleProps> = ({
  leads,
  userRole,
  onUpdateLeadInstallation,
  onUpdateLeadPayment,
  onUpdateLeadSubsidy
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'installation' | 'inventory' | 'payments' | 'subsidy'>('installation');
  
  // Projects in execution or won
  const deliveryLeads = leads.filter(l => l.stage === 'won' || l.stage === 'negotiation' || l.stage === 'site_survey');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(deliveryLeads[0]?.id || leads[0]?.id || '');
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  const activeLead = leads.find(l => l.id === selectedLeadId) || deliveryLeads[0] || leads[0];

  // Default steps if lead doesn't have any
  const currentSteps: InstallationChecklistStep[] = activeLead?.installationSteps?.length > 0 ? activeLead.installationSteps : [
    { id: 's1', title: 'BOS & PV Module Dispatch to Site', description: 'Modules, structure rails, and accessories delivered', completed: false, assignedTeam: 'Logistics Fleet 1', photoUploaded: false },
    { id: 's2', title: 'Mounting Structure Erection & Anchoring', description: 'Base foundation bolting and chemical anchors', completed: false, assignedTeam: 'Fabrication Team A', photoUploaded: false },
    { id: 's3', title: 'Solar Panel Clamping & Fastening', description: 'Mid/end clamps torqued to manufacturer specs', completed: false, assignedTeam: 'Kiran Verma Installer Team', photoUploaded: false },
    { id: 's4', title: 'DC Cabling & Surge Earthing Pit', description: 'DC wiring in UV conduits and lightning arrestor', completed: false, assignedTeam: 'Electrical Team B', photoUploaded: false },
    { id: 's5', title: 'Inverter Mounting & AC Distribution Box', description: 'Inverter wall mounting and grid synchronization wiring', completed: false, assignedTeam: 'Kiran Verma Installer Team', photoUploaded: false },
    { id: 's6', title: 'Pre-Commissioning Testing & Megger Tests', description: 'VOC, ISC, string polarity, and ground resistance check', completed: false, assignedTeam: 'Vikram Rao (Engineer)', photoUploaded: false },
    { id: 's7', title: 'DISCOM Net-Meter Synchronization', description: 'Bi-directional net meter energization and test report', completed: false, assignedTeam: 'Liaisoning Desk', photoUploaded: false }
  ];

  const handleToggleStep = (stepId: string) => {
    if (!activeLead) return;
    const updated = currentSteps.map(s => {
      if (s.id === stepId) {
        const nextCompleted = !s.completed;
        return {
          ...s,
          completed: nextCompleted,
          completedDate: nextCompleted ? new Date().toISOString().slice(0, 10) : undefined,
          photoUploaded: nextCompleted ? true : s.photoUploaded
        };
      }
      return s;
    });
    onUpdateLeadInstallation(activeLead.id, updated);
  };

  const handleTogglePayment = (payId: string) => {
    if (!activeLead) return;
    const updated = activeLead.payments.map(p => {
      if (p.id === payId) {
        const nextPaid = p.status !== 'Paid';
        return {
          ...p,
          status: nextPaid ? ('Paid' as const) : ('Pending' as const),
          paidDate: nextPaid ? new Date().toISOString().slice(0, 10) : undefined
        };
      }
      return p;
    });
    onUpdateLeadPayment(activeLead.id, updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Sub-Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Project Delivery, Inventory & Payments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Field installation stages, photo checkpoints, warehouse inventory allocation, and DISCOM net-metering milestones
          </p>
        </div>

        {/* Sub-tabs segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveSubTab('installation')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'installation' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Installation Tracking
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'inventory' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Inventory Stock
          </button>
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'payments' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Payments & Invoices
          </button>
          <button
            onClick={() => setActiveSubTab('subsidy')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'subsidy' ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Subsidy & DISCOM
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Installation Tracking */}
      {activeSubTab === 'installation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#0e1432] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Active Project:</span>
              <select
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-900 dark:text-white font-medium"
              >
                {deliveryLeads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.customerName} ({l.recommendedCapacityKw} kWp · {l.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
              Completed: <strong className="text-emerald-700 dark:text-emerald-300">{currentSteps.filter(s => s.completed).length}</strong> of {currentSteps.length} stages
            </div>
          </div>

          <div className="space-y-3">
            {currentSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.completed ? 'bg-emerald-50/40 border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-[#0e1432] border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleStep(step.id)}
                    className={`mt-0.5 p-1 rounded-md transition-colors cursor-pointer ${
                      step.completed ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-700 text-transparent hover:border-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Stage 0{idx + 1}</span>
                      <h4 className={`text-xs font-bold ${step.completed ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>Assigned: <strong className="text-slate-700 dark:text-slate-200">{step.assignedTeam}</strong></span>
                      {step.completedDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-emerald-700 dark:text-emerald-300">Completed on {step.completedDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[12px] font-mono px-2 py-1 rounded flex items-center gap-1 ${
                    step.photoUploaded ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    <Camera className="w-3 h-3" />
                    <span>{step.photoUploaded ? 'Photo Verified' : 'Photo Required'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Inventory Tracking */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Warehouse PV Hardware & BOS Stock
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live inventory tracking against active project allocations (Panels, Inverters, HDGI Structures, DC Cables)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Item Category & Model</th>
                  <th className="py-2.5 px-3">Technical Specification</th>
                  <th className="py-2.5 px-3 text-right">Total Stock</th>
                  <th className="py-2.5 px-3 text-right">Allocated</th>
                  <th className="py-2.5 px-3 text-right">Available</th>
                  <th className="py-2.5 px-3 text-right">Unit Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inventoryList.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{inv.brandModel}</div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{inv.category}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 text-[12px]">
                      {inv.specification}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {inv.totalStock.toLocaleString()} {inv.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-brand-700 dark:text-brand-300">
                      {inv.allocatedForProjects.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {inv.availableStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200">
                      {formatINR(inv.unitCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 3: Payments & Milestone Invoices */}
      {activeSubTab === 'payments' && activeLead && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#0e1432] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Customer Account:</span>
              <select
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-900 dark:text-white font-medium"
              >
                {leads.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.customerName} ({l.recommendedCapacityKw} kWp)
                  </option>
                ))}
              </select>
            </div>

            <div className="text-slate-600 dark:text-slate-300 font-mono">
              Total Contract: <strong className="text-slate-900 dark:text-white">{formatINR(activeLead.netPayableAmount || activeLead.estimatedQuoteValue)}</strong>
            </div>
          </div>

          <div className="space-y-3">
            {activeLead.payments.length === 0 ? (
              <div className="p-8 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-xs">
                No payment milestones created for this lead yet.
              </div>
            ) : (
              activeLead.payments.map(pay => (
                <div
                  key={pay.id}
                  className="p-4 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{pay.title}</span>
                      {pay.invoiceNumber && (
                        <span className="font-mono text-[12px] text-slate-500 dark:text-slate-400">
                          Invoice: {pay.invoiceNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[12px] font-mono">
                      <span>Due: {pay.dueDate}</span>
                      {pay.paidDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 dark:text-emerald-300">Paid on: {pay.paidDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {formatINR(pay.amount)}
                    </span>

                    <button
                      onClick={() => handleTogglePayment(pay.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        pay.status === 'Paid'
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                          : 'bg-brand-100 dark:bg-brand-500/20 text-brand-900 dark:text-brand-300 hover:bg-emerald-100'
                      }`}
                    >
                      {pay.status === 'Paid' ? 'Paid ✓' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 4: Subsidy & Net-Metering Tracker */}
      {activeSubTab === 'subsidy' && activeLead && (
        <div className="p-6 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                DISCOM Net-Metering & PM Surya Ghar Subsidy Tracker
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overcome the primary solar bottleneck: track portal applications, sanction letters, and meter commissioning
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">
              DISCOM: {activeLead.subsidyTracker?.discomName || 'BESCOM'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[12px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                National Portal Application
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                App #: {activeLead.subsidyTracker?.nationalPortalAppNumber || 'Not submitted'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-mono rounded text-[12px]">
                  {activeLead.subsidyTracker?.nationalPortalStatus || 'Pending'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[12px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                DISCOM Feasibility & Net Metering
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Sanction: {activeLead.subsidyTracker?.sanctionLetterNumber || 'Awaiting issuance'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono rounded text-[12px]">
                  {activeLead.subsidyTracker?.discomSanctionStatus || 'Application Submitted'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
