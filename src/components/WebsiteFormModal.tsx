import React, { useState, useMemo } from 'react';
import { PropertyType, RoofType, SolarLead } from '../types/crm';
import { calculateSolarSystem, formatINR } from '../utils/solarCalculator';
import { IMAGES } from '../assets/images';
import { X, Sun, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface WebsiteFormModalProps {
  onClose: () => void;
  onSubmitLead: (newLead: SolarLead) => void;
}

export const WebsiteFormModal: React.FC<WebsiteFormModalProps> = ({
  onClose,
  onSubmitLead
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [propertyType, setPropertyType] = useState<PropertyType>('Home / Villa');
  const [monthlyBill, setMonthlyBill] = useState<number>(9500);
  const [roofArea, setRoofArea] = useState<number>(1000);
  const [budget, setBudget] = useState<number>(450000);
  const [submitted, setSubmitted] = useState(false);

  const calc = useMemo(() => {
    return calculateSolarSystem({
      monthlyBill,
      customerType: propertyType === 'Home / Villa' ? 'residential' : 'commercial',
      availableRoofAreaSqFt: roofArea
    });
  }, [monthlyBill, propertyType, roofArea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newLead: SolarLead = {
      id: `sq-${Date.now().toString().slice(-4)}`,
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: `${city}, Karnataka`,
      city: city.trim(),
      state: 'Karnataka',
      propertyType,
      monthlyBill,
      roofAreaSqFt: roofArea,
      roofType: propertyType === 'Home / Villa' ? 'RCC Flat Roof' : 'Metal Sheet Shed',
      systemType: 'On-Grid',
      customerBudget: budget,
      recommendedCapacityKw: calc.recommendedCapacityKw,
      estimatedQuoteValue: calc.grossSystemCost,
      estimatedSubsidyAmount: calc.subsidyAmount,
      netPayableAmount: calc.netInvestment,
      stage: 'new',
      priority: 'High',
      source: 'Website Form',
      assignedTo: 'Ananya Sharma',
      createdDate: new Date().toISOString().slice(0, 10),
      lastContactedDate: new Date().toISOString().slice(0, 10),
      nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      untouchedAlert: false,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'stage_change',
          author: 'Website Lead Engine',
          role: 'admin',
          title: 'Direct Inbound Lead from SolarQube Website',
          description: `Customer submitted inquiry form on public landing page. Monthly Bill: ₹${monthlyBill.toLocaleString()}, Roof Area: ${roofArea} sq.ft. Auto-sized to ${calc.recommendedCapacityKw} kWp.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      ],
      proposals: [],
      documents: [],
      installationSteps: [],
      payments: []
    };

    onSubmitLead(newLead);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="relative bg-slate-900 text-white p-6 sm:p-7 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={IMAGES.logoIcon} alt="SolarQube Energy" className="w-10 h-10 object-contain" />
              <div>
                <span className="text-xs font-mono text-brand-400">PUBLIC EMBEDDED FORM</span>
                <h3 className="text-lg font-bold text-white">
                  SolarQube Energy: Get Your Rooftop Solar Sizing
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            This live form feeds directly into the CRM with source tagged as <strong className="text-brand-300">Website Form</strong>.
          </p>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Lead Submitted & Logged to CRM!
            </h4>
            <p className="text-xs text-slate-500">
              Assigned to Ananya Sharma. Sizing calculated: {calc.recommendedCapacityKw} kWp.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98450 99887"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / Location</label>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Monthly Bill (₹)</label>
                <input
                  type="number"
                  value={monthlyBill}
                  onChange={e => setMonthlyBill(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Roof Area (sq.ft)</label>
                <input
                  type="number"
                  value={roofArea}
                  onChange={e => setRoofArea(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Budget (₹)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Instant calculated banner */}
            <div className="p-3.5 bg-brand-50/70 border border-brand-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[12px] font-mono text-brand-900 block font-semibold">
                  ESTIMATED SIZING: {calc.recommendedCapacityKw} kWp
                </span>
                <span className="text-[12px] text-brand-800">
                  Net Cost: {formatINR(calc.netInvestment)} · Annual Savings: ~{formatINR(calc.annualSavings)}/yr
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {calc.subsidyAmount > 0 ? `₹${calc.subsidyAmount.toLocaleString()} Subsidy` : '40% AD Benefit'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <span>Submit to CRM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
