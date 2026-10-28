import React, { useState } from 'react';
import { SolarLead, ProposalVersion } from '../types/crm';
import { formatINR } from '../utils/solarCalculator';
import { IMAGES } from '../assets/images';
import { 
  FileText, 
  Printer, 
  Plus, 
  Eye, 
  CheckCircle, 
  TrendingUp, 
  Layers, 
  Send,
  History,
  ShieldCheck
} from 'lucide-react';

interface QuotationModuleProps {
  leads: SolarLead[];
  onAddProposalVersion: (leadId: string, proposal: ProposalVersion) => void;
  onUpdateProposalStatus: (leadId: string, proposalId: string, newStatus: ProposalVersion['status']) => void;
}

export const QuotationModule: React.FC<QuotationModuleProps> = ({
  leads,
  onAddProposalVersion,
  onUpdateProposalStatus
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [activeProposalToPrint, setActiveProposalToPrint] = useState<ProposalVersion | null>(null);

  const activeLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  // Proposal builder form state
  const [systemSizeKw, setSystemSizeKw] = useState<number>(activeLead?.recommendedCapacityKw || 10);
  const [panelBrand, setPanelBrand] = useState('Waaree 550Wp TOPCon Bifacial Glass-to-Glass');
  const [inverterBrand, setInverterBrand] = useState('Growatt 10kVA Three-Phase Dual MPPT');
  const [structureType, setStructureType] = useState('Elevated 7ft Walk-Under HDGI Structure');
  const [grossPrice, setGrossPrice] = useState<number>(activeLead?.estimatedQuoteValue || 580000);
  const [subsidyAmount, setSubsidyAmount] = useState<number>(activeLead?.estimatedSubsidyAmount || 78000);

  const handleSelectLead = (id: string) => {
    setSelectedLeadId(id);
    const l = leads.find(x => x.id === id);
    if (l) {
      setSystemSizeKw(l.recommendedCapacityKw);
      setGrossPrice(l.estimatedQuoteValue);
      setSubsidyAmount(l.estimatedSubsidyAmount);
    }
  };

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;

    const currentVersions = activeLead.proposals.length;
    const nextVer = `v${(1 + currentVersions * 0.1).toFixed(1)}`;

    const netPrice = Math.max(0, grossPrice - subsidyAmount);
    const annualSavings = Math.round(systemSizeKw * 125 * 12 * 8.5);
    const paybackYears = Number((netPrice / Math.max(1, annualSavings)).toFixed(1));

    const newProp: ProposalVersion = {
      id: `pr-${Date.now()}`,
      versionNumber: nextVer,
      systemSizeKw,
      panelBrand,
      inverterBrand,
      structureType,
      grossPrice,
      subsidyAmount,
      netPrice,
      annualSavings,
      paybackYears,
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'Sent',
      openedCount: 1
    };

    onAddProposalVersion(activeLead.id, newProp);
  };

  const handleOpenPrint = (prop: ProposalVersion) => {
    setActiveProposalToPrint(prop);
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quotation & Proposal Versioning Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineer customized solar proposals with tier-1 panel & inverter selections, PM Surya Ghar subsidies, and view tracking
          </p>
        </div>

        {/* Lead selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#0e1432] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">Customer:</span>
          <select
            value={selectedLeadId}
            onChange={e => handleSelectLead(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white font-medium"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>
                {l.customerName} ({l.recommendedCapacityKw} kWp · {l.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols): Create / Revise Proposal Form */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleCreateVersion} className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Generate Quotation Version
                </h2>
                <span className="text-[12px] font-mono text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded">
                  v{(1 + activeLead.proposals.length * 0.1).toFixed(1)} Next
                </span>
              </div>

              {/* System Size & Gross Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Capacity (kWp)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={systemSizeKw}
                    onChange={e => setSystemSizeKw(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Gross Price (₹)</label>
                  <input
                    type="number"
                    value={grossPrice}
                    onChange={e => setGrossPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Panel Brand Selection */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Tier-1 Solar PV Module Brand
                </label>
                <select
                  value={panelBrand}
                  onChange={e => setPanelBrand(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Waaree 550Wp TOPCon Bifacial Glass-to-Glass">Waaree 550Wp TOPCon Bifacial Glass-to-Glass (DCR)</option>
                  <option value="Adani Solar 550Wp Bifacial Mono PERC">Adani Solar 550Wp Bifacial Mono PERC</option>
                  <option value="Tata Power Solar 550Wp High Efficiency">Tata Power Solar 550Wp High Efficiency</option>
                  <option value="Goldi Solar 540Wp Mono PERC">Goldi Solar 540Wp Mono PERC</option>
                </select>
              </div>

              {/* Inverter Brand Selection */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Solar Inverter Brand & Model
                </label>
                <select
                  value={inverterBrand}
                  onChange={e => setInverterBrand(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Growatt 10kVA Three-Phase Dual MPPT">Growatt 10kVA Three-Phase Dual MPPT</option>
                  <option value="Sungrow SG110CX Commercial Inverter">Sungrow SG110CX Commercial Inverter</option>
                  <option value="Solis 15kVA On-Grid Inverter">Solis 15kVA On-Grid Inverter</option>
                  <option value="Deye 12kVA Hybrid with Lithium Battery Support">Deye 12kVA Hybrid with Battery Support</option>
                </select>
              </div>

              {/* Structure Type */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Mounting Structure Specification
                </label>
                <select
                  value={structureType}
                  onChange={e => setStructureType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Elevated 7ft Walk-Under HDGI Structure">Elevated 7ft Walk-Under HDGI Structure</option>
                  <option value="Aluminium Non-Penetrative Mini-Rail Clamps">Aluminium Non-Penetrative Mini-Rail Clamps</option>
                  <option value="Standard Flush Rooftop HDGI Rails">Standard Flush Rooftop HDGI Rails</option>
                  <option value="Ground Mounted Galvanized Rammed Post Structure">Ground Mounted Rammed Post Structure</option>
                </select>
              </div>

              {/* Subsidy Deduction */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Govt Subsidy (₹)</label>
                  <input
                    type="number"
                    value={subsidyAmount}
                    onChange={e => setSubsidyAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">Net Payable (₹)</label>
                  <div className="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(Math.max(0, grossPrice - subsidyAmount))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 text-white font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-brand-400" />
                <span>Save & Issue Proposal Version</span>
              </button>
            </form>
          </div>

          {/* Right Column (7 cols): Version History & Customer Open Tracking */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Proposal Versions & View Tracker</span>
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {activeLead.proposals.length} versions issued
                </span>
              </div>

              {activeLead.proposals.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs italic">
                  No proposal versions created yet. Use the generator on the left to issue v1.0.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeLead.proposals.map(prop => (
                    <div
                      key={prop.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 dark:bg-[#0a0f2a] dark:border dark:border-slate-700 text-brand-400 font-mono font-bold rounded">
                              {prop.versionNumber}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {prop.systemSizeKw} kWp Turnkey Solution
                            </span>
                          </div>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1">
                            {prop.panelBrand} · {prop.inverterBrand}
                          </p>
                        </div>

                        {/* Open Tracker Badge */}
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 font-mono text-[12px] px-2 py-0.5 rounded ${
                            prop.status === 'Accepted'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold'
                              : prop.status === 'Viewed by Customer'
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 font-semibold'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}>
                            <Eye className="w-3 h-3" />
                            <span>{prop.status} ({prop.openedCount} opens)</span>
                          </span>
                        </div>
                      </div>

                      {/* Pricing strip */}
                      <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#0e1432] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[12px] font-mono">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Gross Value</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{formatINR(prop.grossPrice)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Subsidy</span>
                          <span className="text-emerald-700 dark:text-emerald-300">-{formatINR(prop.subsidyAmount)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Net Payable</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatINR(prop.netPrice)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400">
                          <span>Payback: <strong className="text-slate-800 dark:text-slate-100">{prop.paybackYears} yrs</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>Savings: <strong className="text-emerald-700 dark:text-emerald-300">{formatINR(prop.annualSavings)}/yr</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={prop.status}
                            onChange={e => onUpdateProposalStatus(activeLead.id, prop.id, e.target.value as any)}
                            className="text-[12px] bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-100"
                          >
                            <option value="Sent">Sent</option>
                            <option value="Viewed by Customer">Customer Viewed</option>
                            <option value="Accepted">Accepted / Won</option>
                            <option value="Revised">Revised</option>
                          </select>

                          <button
                            onClick={() => handleOpenPrint(prop)}
                            className="px-2.5 py-1 text-[12px] font-medium text-slate-900 dark:text-white bg-white dark:bg-[#0e1432] border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            <span>Print PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Branded PDF Quotation Print View */}
      {showPrintModal && activeProposalToPrint && activeLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src={IMAGES.logo} alt="SolarQube Energy" className="h-10 w-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    SolarQube Official Engineering Proposal ({activeProposalToPrint.versionNumber})
                  </h3>
                  <p className="text-xs text-slate-500">SolarQube Energy Pvt Ltd · ISO 9001:2015 Certified Solar EPC</p>
                </div>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-500 hover:text-slate-600 font-bold">
                ×
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[12px]">Prepared For Client:</span>
                  <p className="font-bold text-slate-900">{activeLead.customerName}</p>
                  <p className="text-slate-600">{activeLead.address}</p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[12px]">Date & Version:</span>
                  <p className="font-mono text-slate-900">{activeProposalToPrint.createdDate} ({activeProposalToPrint.versionNumber})</p>
                  <p className="text-slate-600">Assigned Consultant: {activeLead.assignedTo}</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="p-2.5">Scope Item</th>
                      <th className="p-2.5">Component Specification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-medium">Plant Capacity</td>
                      <td className="p-2.5 font-mono">{activeProposalToPrint.systemSizeKw} kWp Grid-Tied</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">PV Modules</td>
                      <td className="p-2.5">{activeProposalToPrint.panelBrand}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Inverter</td>
                      <td className="p-2.5">{activeProposalToPrint.inverterBrand}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Mounting Structure</td>
                      <td className="p-2.5">{activeProposalToPrint.structureType}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Gross EPC Price</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">{formatINR(activeProposalToPrint.grossPrice)}</td>
                    </tr>
                    {activeProposalToPrint.subsidyAmount > 0 && (
                      <tr className="text-emerald-700">
                        <td className="p-2.5 font-medium">PM Surya Ghar DBT Subsidy</td>
                        <td className="p-2.5 font-mono font-bold">- {formatINR(activeProposalToPrint.subsidyAmount)}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-50 font-bold text-slate-900 text-sm">
                      <td className="p-2.5">Net Customer Payable</td>
                      <td className="p-2.5 font-mono">{formatINR(activeProposalToPrint.netPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
