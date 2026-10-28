import React, { useState, useMemo } from 'react';
import { 
  SolarLead, 
  PropertyType, 
  RoofType, 
  SystemType, 
  LeadSource, 
  PipelineStage 
} from '../types/crm';
import { TEAM_MEMBERS } from '../data/initialData';
import { calculateSolarSystem, formatINR } from '../utils/solarCalculator';
import { X, Zap, Sparkles, Building2, Home } from 'lucide-react';

interface NewLeadModalProps {
  onClose: () => void;
  onAddLead: (lead: SolarLead) => void;
  initialData?: Partial<SolarLead>;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  onClose,
  onAddLead,
  initialData
}) => {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [companyOrSocietyName, setCompanyOrSocietyName] = useState(initialData?.companyOrSocietyName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [city, setCity] = useState(initialData?.city || 'Bengaluru');
  const [state, setState] = useState(initialData?.state || 'Karnataka');
  const [address, setAddress] = useState(initialData?.address || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(initialData?.propertyType || 'Home / Villa');
  const [monthlyBill, setMonthlyBill] = useState<number>(initialData?.monthlyBill || 12000);
  const [roofAreaSqFt, setRoofAreaSqFt] = useState<number>(initialData?.roofAreaSqFt || 1200);
  const [roofType, setRoofType] = useState<RoofType>(initialData?.roofType || 'RCC Flat Roof');
  const [systemType, setSystemType] = useState<SystemType>(initialData?.systemType || 'On-Grid');
  const [customerBudget, setCustomerBudget] = useState<number>(550000);
  const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || 'Ananya Sharma');
  const [source, setSource] = useState<LeadSource>(initialData?.source || 'Website Form');

  const calc = useMemo(() => {
    return calculateSolarSystem({
      monthlyBill,
      customerType: propertyType === 'Home / Villa' ? 'residential' : 'commercial',
      availableRoofAreaSqFt: roofAreaSqFt
    });
  }, [monthlyBill, propertyType, roofAreaSqFt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    const newLead: SolarLead = {
      id: `sq-${Date.now().toString().slice(-4)}`,
      customerName: customerName.trim(),
      companyOrSocietyName: companyOrSocietyName.trim() || undefined,
      email: email.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: phone.trim(),
      city: city.trim(),
      state: state.trim(),
      address: address.trim() || `${city}, ${state}`,
      propertyType,
      monthlyBill,
      roofAreaSqFt,
      roofType,
      systemType,
      customerBudget,
      recommendedCapacityKw: calc.recommendedCapacityKw,
      estimatedQuoteValue: calc.grossSystemCost,
      estimatedSubsidyAmount: calc.subsidyAmount,
      netPayableAmount: calc.netInvestment,
      stage: 'new',
      priority: 'High',
      source,
      assignedTo,
      createdDate: new Date().toISOString().slice(0, 10),
      lastContactedDate: new Date().toISOString().slice(0, 10),
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      untouchedAlert: false,
      activities: [
        {
          id: `act-${Date.now()}`,
          author: assignedTo,
          role: 'sales',
          type: 'stage_change',
          title: 'Lead Captured in CRM',
          description: `Captured via ${source}. Recommended ${calc.recommendedCapacityKw} kWp system based on ₹${monthlyBill.toLocaleString()} monthly power consumption.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      ],
      proposals: [],
      documents: [],
      installationSteps: [],
      payments: []
    };

    onAddLead(newLead);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Register New Solar Lead
            </h2>
            <p className="text-xs text-slate-500">
              Omni-channel lead capture with customer budget, property categorization, and auto-sizing
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kulkarni"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Company / Society / Farm Name</label>
              <input
                type="text"
                value={companyOrSocietyName}
                onChange={e => setCompanyOrSocietyName(e.target.value)}
                placeholder="e.g. Kulkarni Farms / Society"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value as PropertyType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="Home / Villa">Home / Villa</option>
                <option value="Commercial / Office">Commercial / Office</option>
                <option value="Factory / Industrial Shed">Factory / Industrial Shed</option>
                <option value="Farm / Agricultural Pump">Farm / Agricultural Pump</option>
                <option value="Residential Society (Common Area)">Residential Society</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lead Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Monthly Bill (₹)</label>
              <input
                type="number"
                min="1000"
                value={monthlyBill}
                onChange={e => setMonthlyBill(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Roof/Land Area (sq.ft)</label>
              <input
                type="number"
                min="100"
                value={roofAreaSqFt}
                onChange={e => setRoofAreaSqFt(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Budget (₹)</label>
              <input
                type="number"
                value={customerBudget}
                onChange={e => setCustomerBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Roof Type</label>
              <select
                value={roofType}
                onChange={e => setRoofType(e.target.value as RoofType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="RCC Flat Roof">RCC Flat Roof</option>
                <option value="Metal Sheet Shed">Metal Sheet Shed</option>
                <option value="Tiled Slanted">Tiled Slanted</option>
                <option value="Ground Mount">Ground Mount</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Assign Sales Rep</label>
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                {TEAM_MEMBERS.map(m => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sizing result banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[12px] font-mono text-brand-400">
              <span>SOLARQUBE AUTO-SIZING</span>
              <span>100% TopCon Bifacial</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div>
                <span className="text-slate-300 text-[11px] block font-sans">Capacity</span>
                <span className="font-bold text-white text-base">{calc.recommendedCapacityKw} kWp</span>
              </div>
              <div>
                <span className="text-slate-300 text-[11px] block font-sans">Net Price</span>
                <span className="font-bold text-white text-base">{formatINR(calc.netInvestment)}</span>
              </div>
              <div>
                <span className="text-slate-300 text-[11px] block font-sans">Subsidy</span>
                <span className="font-bold text-emerald-400 text-base">
                  {calc.subsidyAmount > 0 ? formatINR(calc.subsidyAmount) : 'AD 40%'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg font-medium shadow-xs"
            >
              Create Solar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
