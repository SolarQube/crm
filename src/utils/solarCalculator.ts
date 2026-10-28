import { CustomerType, RoofType } from '../types/crm';

export interface SolarCalculationResult {
  recommendedCapacityKw: number;
  monthlyGenerationKwh: number;
  annualGenerationKwh: number;
  panelCount: number;
  panelWattageWp: number;
  roofAreaRequiredSqFt: number;
  grossSystemCost: number;
  subsidyAmount: number;
  netInvestment: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  co2OffsetTonnesAnnual: number;
  twentyFiveYearSavings: number;
  inverterCapacityKw: number;
}

export function calculateSolarSystem(params: {
  monthlyBill: number;
  customerType: CustomerType;
  availableRoofAreaSqFt?: number;
  tariffPerKwh?: number;
}): SolarCalculationResult {
  const { monthlyBill, customerType, availableRoofAreaSqFt } = params;
  
  // Default tariff rates if not passed (INR)
  const defaultTariff = customerType === 'residential' ? 8.5 : 11.2;
  const tariff = params.tariffPerKwh || defaultTariff;

  // Approximate monthly kWh consumption
  const estimatedMonthlyKwh = Math.max(50, monthlyBill / tariff);

  // Sizing: 1 kWp produces ~125 kWh per month in favorable solar conditions
  const rawKwNeeded = estimatedMonthlyKwh / 125;

  // Check roof area limitation (approx 90-100 sq ft per kW)
  let recommendedKw = Math.max(1, Math.round(rawKwNeeded * 2) / 2); // rounded to nearest 0.5 kW

  if (availableRoofAreaSqFt && availableRoofAreaSqFt > 0) {
    const maxKwFromRoof = Math.floor(availableRoofAreaSqFt / 95);
    if (recommendedKw > maxKwFromRoof && maxKwFromRoof >= 1) {
      recommendedKw = maxKwFromRoof;
    }
  }

  // Cap minimum at 1 kW, max for residential usually 20kW, commercial can be up to 500kW
  if (customerType === 'residential') {
    recommendedKw = Math.min(25, Math.max(1, recommendedKw));
  } else {
    recommendedKw = Math.min(500, Math.max(3, recommendedKw));
  }

  const panelWattageWp = 550; // TopCon 550Wp bifacial
  const panelCount = Math.ceil((recommendedKw * 1000) / panelWattageWp);
  const inverterCapacityKw = Math.ceil(recommendedKw);
  const roofAreaRequiredSqFt = recommendedKw * 95;

  // Pricing benchmarks
  let costPerKw = 60000;
  if (customerType === 'residential') {
    costPerKw = recommendedKw <= 3 ? 65000 : 58000;
  } else if (customerType === 'commercial' || customerType === 'industrial') {
    costPerKw = recommendedKw >= 50 ? 44000 : 49000;
  } else {
    costPerKw = 52000;
  }

  const grossSystemCost = Math.round(recommendedKw * costPerKw);

  // Subsidy computation (PM Surya Ghar scheme for residential)
  let subsidyAmount = 0;
  if (customerType === 'residential') {
    if (recommendedKw <= 1) {
      subsidyAmount = 30000;
    } else if (recommendedKw <= 2) {
      subsidyAmount = 60000;
    } else {
      subsidyAmount = 78000; // Capped at 78,000 for 3kW and above
    }
  }

  const netInvestment = Math.max(0, grossSystemCost - subsidyAmount);

  // Generation & Savings
  const monthlyGenerationKwh = Math.round(recommendedKw * 125);
  const annualGenerationKwh = Math.round(monthlyGenerationKwh * 12);
  const monthlySavings = Math.round(monthlyGenerationKwh * tariff);
  const annualSavings = Math.round(monthlySavings * 12);

  const paybackYears = Number((netInvestment / Math.max(1, annualSavings)).toFixed(1));
  const co2OffsetTonnesAnnual = Number((recommendedKw * 1.3).toFixed(1));
  
  // 25-year cumulative savings with 0.7% degradation and 3% annual grid tariff inflation
  let twentyFiveYearSavings = 0;
  let currentTariff = tariff;
  let currentGen = annualGenerationKwh;
  for (let y = 1; y <= 25; y++) {
    twentyFiveYearSavings += currentGen * currentTariff;
    currentTariff *= 1.03;
    currentGen *= 0.993;
  }
  twentyFiveYearSavings = Math.round(twentyFiveYearSavings - netInvestment);

  return {
    recommendedCapacityKw: recommendedKw,
    monthlyGenerationKwh,
    annualGenerationKwh,
    panelCount,
    panelWattageWp,
    roofAreaRequiredSqFt,
    grossSystemCost,
    subsidyAmount,
    netInvestment,
    monthlySavings,
    annualSavings,
    paybackYears,
    co2OffsetTonnesAnnual,
    twentyFiveYearSavings,
    inverterCapacityKw
  };
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}
