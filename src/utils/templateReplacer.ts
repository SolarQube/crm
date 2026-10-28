import { SolarLead } from '../types/crm';
import { calculateSolarSystem, formatINR } from './solarCalculator';

export function substituteEmailTokens(template: string, lead: SolarLead): string {
  const customerType = lead.customerType || (lead.propertyType === 'Home / Villa' ? 'residential' : 'commercial');

  const calc = calculateSolarSystem({
    monthlyBill: lead.monthlyBill,
    customerType,
    availableRoofAreaSqFt: lead.roofAreaSqFt
  });

  const tokens: Record<string, string> = {
    customer_name: lead.customerName,
    company_or_society: lead.companyOrSocietyName || lead.customerName,
    system_size_kw: lead.recommendedCapacityKw.toString(),
    monthly_bill: formatINR(lead.monthlyBill),
    monthly_generation_kwh: calc.monthlyGenerationKwh.toLocaleString(),
    annual_savings: formatINR(calc.annualSavings),
    gross_cost: formatINR(lead.estimatedQuoteValue || calc.grossSystemCost),
    subsidy_amount: formatINR(lead.estimatedSubsidyAmount || calc.subsidyAmount),
    net_cost: formatINR(lead.netPayableAmount || calc.netInvestment),
    payback_years: calc.paybackYears.toString(),
    twenty_five_year_savings: formatINR(calc.twentyFiveYearSavings),
    roof_type: lead.roofType,
    roof_area_sqft: lead.roofAreaSqFt.toLocaleString(),
    assigned_to: lead.assignedTo,
    audit_date: lead.siteSurvey?.scheduledDate || lead.siteAuditDetails?.scheduledDate || 'Upcoming week',
    inspector_name: lead.siteSurvey?.engineerName || lead.siteAuditDetails?.engineerName || 'Vikram Rao',
    address: lead.address || `${lead.city}, ${lead.state}`,
    lead_id: lead.id
  };

  let rendered = template;
  for (const [key, value] of Object.entries(tokens)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, value);
  }
  return rendered;
}
