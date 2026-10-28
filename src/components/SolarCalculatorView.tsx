import React, { useState, useMemo } from 'react';
import { CustomerType, RoofType } from '../types/crm';
import { calculateSolarSystem, formatINR } from '../utils/solarCalculator';
import { IMAGES } from '../assets/images';
import { 
  Zap, 
  Sun, 
  Coins, 
  ShieldCheck, 
  Leaf, 
  Printer, 
  Plus, 
  Sliders, 
  ArrowRight,
  CheckCircle2,
  Building,
  Home,
  Factory
} from 'lucide-react';

interface SolarCalculatorViewProps {
  onCreateLeadFromCalc: (calcData: {
    monthlyBill: number;
    roofAreaSqFt: number;
    customerType: CustomerType;
    roofType: RoofType;
    recommendedCapacityKw: number;
    estimatedQuoteValue: number;
    estimatedSubsidyAmount: number;
    netPayableAmount: number;
  }) => void;
}

export const SolarCalculatorView: React.FC<SolarCalculatorViewProps> = ({
  onCreateLeadFromCalc
}) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(12000);
  const [roofArea, setRoofArea] = useState<number>(1200);
  const [customerType, setCustomerType] = useState<CustomerType>('residential');
  const [roofType, setRoofType] = useState<RoofType>('RCC Flat Roof');
  const [tariffPerKwh, setTariffPerKwh] = useState<number>(8.5);
  const [showQuotationPrint, setShowQuotationPrint] = useState(false);
  const [quoteCustomerName, setQuoteCustomerName] = useState('Prospective Client');

  const calc = useMemo(() => {
    return calculateSolarSystem({
      monthlyBill,
      customerType,
      availableRoofAreaSqFt: roofArea,
      tariffPerKwh
    });
  }, [monthlyBill, roofArea, customerType, tariffPerKwh]);

  const handleApplyDefaults = (type: CustomerType) => {
    setCustomerType(type);
    if (type === 'residential') {
      setMonthlyBill(9500);
      setRoofArea(1000);
      setTariffPerKwh(8.5);
      setRoofType('RCC Flat Roof');
    } else if (type === 'commercial') {
      setMonthlyBill(85000);
      setRoofArea(8000);
      setTariffPerKwh(11.2);
      setRoofType('Metal Sheet Shed');
    } else {
      setMonthlyBill(240000);
      setRoofArea(22000);
      setTariffPerKwh(10.8);
      setRoofType('Metal Sheet Shed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Solar Sizing & Proposal Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Precision engineering calculations, PM Surya Ghar subsidy modeling, and 25-year levelized financial yields
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuotationPrint(true)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0e1432] border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Generate Formal Quotation</span>
          </button>
          <button
            onClick={() =>
              onCreateLeadFromCalc({
                monthlyBill,
                roofAreaSqFt: roofArea,
                customerType,
                roofType,
                recommendedCapacityKw: calc.recommendedCapacityKw,
                estimatedQuoteValue: calc.grossSystemCost,
                estimatedSubsidyAmount: calc.subsidyAmount,
                netPayableAmount: calc.netInvestment
              })
            }
            className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 rounded-lg hover:bg-slate-800 dark:hover:bg-brand-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            <span>Create Lead From Sizing</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Parameter Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Project Input Parameters
            </h2>

            {/* Segmented Customer Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                Installation Category
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => handleApplyDefaults('residential')}
                  className={`py-1.5 rounded-md font-medium transition-colors ${
                    customerType === 'residential'
                      ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Residential
                </button>
                <button
                  onClick={() => handleApplyDefaults('commercial')}
                  className={`py-1.5 rounded-md font-medium transition-colors ${
                    customerType === 'commercial'
                      ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Commercial
                </button>
                <button
                  onClick={() => handleApplyDefaults('industrial')}
                  className={`py-1.5 rounded-md font-medium transition-colors ${
                    customerType === 'industrial'
                      ? 'bg-white dark:bg-[#0e1432] text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  Industrial
                </button>
              </div>
            </div>

            {/* Monthly Electricity Bill Slider & Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Monthly Utility Bill</label>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatINR(monthlyBill)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max={customerType === 'residential' ? 40000 : 400000}
                step="500"
                value={monthlyBill}
                onChange={e => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 font-mono">
                <span>₹2,000</span>
                <span>{customerType === 'residential' ? '₹40,000' : '₹4,00,000'}</span>
              </div>
            </div>

            {/* Roof Area Available Slider & Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-200">Available Unshaded Roof Area</label>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {roofArea.toLocaleString()} sq.ft
                </span>
              </div>
              <input
                type="range"
                min="200"
                max={customerType === 'residential' ? 3000 : 35000}
                step="50"
                value={roofArea}
                onChange={e => setRoofArea(Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 font-mono">
                <span>200 sq.ft</span>
                <span>{customerType === 'residential' ? '3,000 sq.ft' : '35,000 sq.ft'}</span>
              </div>
            </div>

            {/* Roof Surface Type & Grid Tariff */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Roof Structure
                </label>
                <select
                  value={roofType}
                  onChange={e => setRoofType(e.target.value as RoofType)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100"
                >
                  <option value="RCC Flat Roof">RCC Flat Roof</option>
                  <option value="Metal Sheet Shed">Metal Sheet Shed</option>
                  <option value="Tiled Slanted">Tiled Slanted</option>
                  <option value="Ground Mount">Ground Mount</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Grid Tariff (₹/kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tariffPerKwh}
                  onChange={e => setTariffPerKwh(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Engineering Sizing & Financial Yield Matrix */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recommended System Capacity Box */}
          <div className="p-6 bg-slate-900 dark:bg-[#0a0f2a] dark:border dark:border-slate-700 rounded-xl text-white border border-slate-800 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-400 uppercase tracking-wider">
                  ENGINEERED SOLAR SIZING
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  SolarQube TopCon Spec
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                  {calc.recommendedCapacityKw}
                </span>
                <span className="text-lg font-medium text-brand-400">kWp Capacity</span>
              </div>

              {/* Engineering spec grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-300 block text-[12px]">PV Modules</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {calc.panelCount} units
                  </span>
                  <span className="text-[11px] text-slate-400 block">550Wp Bifacial</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[12px]">Inverter Rating</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {calc.inverterCapacityKw} kVA
                  </span>
                  <span className="text-[11px] text-slate-400 block">Smart On-Grid</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[12px]">Monthly Yield</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    ~{calc.monthlyGenerationKwh.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 block">units / month</span>
                </div>
                <div>
                  <span className="text-slate-300 block text-[12px]">Roof Footprint</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {calc.roofAreaRequiredSqFt} sq.ft
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {Math.round((calc.roofAreaRequiredSqFt / roofArea) * 100)}% of roof
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Investment & Yield Matrix */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Financial Payback & Subsidy Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[12px] text-slate-500 dark:text-slate-400 block">Gross Turnkey EPC</span>
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatINR(calc.grossSystemCost)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Includes structure & net meter</span>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                <span className="text-[12px] text-emerald-700 dark:text-emerald-300 block">Govt Subsidy (Surya Ghar)</span>
                <span className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-300 tabular-nums">
                  - {formatINR(calc.subsidyAmount)}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {calc.subsidyAmount > 0 ? 'Direct Bank Transfer (DBT)' : 'AD 40% Tax Benefit'}
                </span>
              </div>

              <div className="p-3 bg-slate-900 dark:bg-[#0a0f2a] dark:border dark:border-slate-700 rounded-lg text-white">
                <span className="text-[12px] text-brand-400 block">Net Customer Outlay</span>
                <span className="text-lg font-bold font-mono text-white tabular-nums">
                  {formatINR(calc.netInvestment)}
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">All-inclusive payable</span>
              </div>
            </div>

            {/* Savings & Payback Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Annual Power Bill Savings</span>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatINR(calc.annualSavings)} / yr
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">Estimated Simple Payback</span>
                <div className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {calc.paybackYears} <span className="text-xs font-sans text-slate-500 dark:text-slate-400">years</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">25-Year Cumulative Savings</span>
                <div className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
                  {formatINR(calc.twentyFiveYearSavings)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formal Printable Quotation Sheet Modal */}
      {showQuotationPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img src={IMAGES.logo} alt="SolarQube Energy" className="h-10 w-auto" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    SolarQube Turnkey Solar Proposal
                  </h3>
                  <p className="text-xs text-slate-500">
                    SolarQube Energy Pvt Ltd · sneha@solarqubeenergy.in
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuotationPrint(false)}
                className="text-slate-500 hover:text-slate-700 text-lg font-bold p-1"
              >
                ×
              </button>
            </div>

            {/* Customer input */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Prepared for:</span>
              <input
                type="text"
                value={quoteCustomerName}
                onChange={e => setQuoteCustomerName(e.target.value)}
                className="text-xs border border-slate-300 rounded px-2.5 py-1 font-medium text-slate-900 flex-1"
                placeholder="Enter customer name..."
              />
            </div>

            {/* Proposal Quotation Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-50 p-3 font-semibold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>Scope of Supply & Engineering Specifications</span>
                <span className="font-mono">{calc.recommendedCapacityKw} kWp System</span>
              </div>
              <div className="p-4 space-y-2 text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>PV Modules</span>
                  <span className="font-medium">{calc.panelCount}x 550Wp Monocrystalline Bifacial TOPCon</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Solar Inverter</span>
                  <span className="font-medium">{calc.inverterCapacityKw} kVA MPPT Grid-Tie String Inverter</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Mounting Structure</span>
                  <span className="font-medium">{roofType} Anodized Aluminium / HDGI 160 km/h wind-rated</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Expected Monthly Generation</span>
                  <span className="font-mono tabular-nums">~{calc.monthlyGenerationKwh.toLocaleString()} kWh/month</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Gross EPC Cost</span>
                  <span className="font-mono font-medium tabular-nums">{formatINR(calc.grossSystemCost)}</span>
                </div>
                {calc.subsidyAmount > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                    <span>Central Government Subsidy (PM Surya Ghar)</span>
                    <span className="font-mono font-medium tabular-nums">- {formatINR(calc.subsidyAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 text-sm font-bold text-slate-900 bg-slate-50 px-2 rounded">
                  <span>Net Turnkey Price Payable</span>
                  <span className="font-mono tabular-nums">{formatINR(calc.netInvestment)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowQuotationPrint(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Quotation Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
