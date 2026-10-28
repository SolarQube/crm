import { UserRole } from '../types/crm';
import { MainNavTab } from '../components/Sidebar';

export interface RolePermissions {
  roleName: string;
  roleTitle: string;
  department: string;
  allowedTabs: MainNavTab[];
  canViewFinancials: boolean; // gross prices, revenue, margins, payment amounts
  canViewCustomerBudget: boolean;
  canEditSurveys: boolean;
  canEditQuotations: boolean;
  canEditInstallation: boolean;
  canEditAutomations: boolean;
  canManageDataBackups: boolean;
  canExportData: boolean;
  canReassignLeads: boolean;
  canViewAuditTrail: boolean;
  canManageAttendance: boolean; // approve leaves, regularize, edit records
  roleDescription: string;
}

export type AccessLevel = 'full' | 'view_only' | 'assigned_only' | 'masked' | 'restricted';

export interface DataCategoryPermission {
  category: string;
  description: string;
  permissions: Record<UserRole, {
    access: AccessLevel;
    note: string;
  }>;
}

export const DATA_VISIBILITY_MATRIX: DataCategoryPermission[] = [
  {
    category: 'Attendance, GPS Punch & Leave Management',
    description: 'Mobile check-in/out with GPS location & selfie, leave applications, regularization, and shift settings',
    permissions: {
      admin: { access: 'full', note: 'Full oversight: approve leaves, regularize, view monthly payroll report' },
      hr: { access: 'full', note: 'Dedicated HR workspace: collect, verify, approve leaves, and export payroll' },
      sales: { access: 'assigned_only', note: 'Mark own attendance, apply for leave, view personal leave balances' },
      project_coordinator: { access: 'full', note: 'View site team punches, track project man-hours, and labor allocation' },
      site_engineer: { access: 'assigned_only', note: 'Mobile GPS punch on project site, selfie, leave requests' },
      installer: { access: 'assigned_only', note: 'Mobile GPS punch on project site, selfie, leave requests' }
    }
  },
  {
    category: 'Project Labor Costing & Site Hours',
    description: 'Man-hours logged per installation site for project costing and budget comparison',
    permissions: {
      admin: { access: 'full', note: 'Full access to actual labor expenditure vs budgeted cost' },
      hr: { access: 'full', note: 'Total hours for salary calculation and overtime computation' },
      sales: { access: 'restricted', note: 'Hidden — Internal operational costing' },
      project_coordinator: { access: 'full', note: 'Primary workspace: match installer hours against project stage' },
      site_engineer: { access: 'view_only', note: 'Log and review site hours for survey and commissioning' },
      installer: { access: 'view_only', note: 'Log daily hours worked on allocated project' }
    }
  },
  {
    category: 'Resource Scheduler & Field Teams (Team A & B)',
    description: 'Assign Team A & Team B technicians across project installation phases with conflict clash guard',
    permissions: {
      admin: { access: 'full', note: 'Full scheduling oversight and conflict override privileges' },
      hr: { access: 'restricted', note: 'Internal site engineering allocations' },
      sales: { access: 'view_only', note: 'View project phase delivery timelines for client updates' },
      project_coordinator: { access: 'full', note: 'Primary workspace: assign members, schedule dates & prevent clashes' },
      site_engineer: { access: 'view_only', note: 'View team assignment and milestone inspection dates' },
      installer: { access: 'view_only', note: 'View team installation dates, site address & phase scope' }
    }
  },
  {
    category: 'Customer Contacts & Site Addresses',
    description: 'Lead name, phone number, email, site geo-location & address',
    permissions: {
      admin: { access: 'full', note: 'Unrestricted across all company leads' },
      hr: { access: 'restricted', note: 'Hidden — Customer commercial privacy' },
      sales: { access: 'full', note: 'Customer discovery, calling & WhatsApp outreach' },
      project_coordinator: { access: 'view_only', note: 'Project address for site team dispatch' },
      site_engineer: { access: 'view_only', note: 'Site survey navigation & address lookup' },
      installer: { access: 'assigned_only', note: 'Only for assigned active delivery sites' }
    }
  },
  {
    category: 'Electricity Bill & Consumption Data',
    description: 'Monthly power bills, sanctioned load (kW), tariff slab, unit consumption',
    permissions: {
      admin: { access: 'full', note: 'Full access for sizing & proposal approval' },
      hr: { access: 'restricted', note: 'Hidden — Customer commercial privacy' },
      sales: { access: 'full', note: 'Required for system sizing & ROI generation' },
      project_coordinator: { access: 'view_only', note: 'Transformer load reference' },
      site_engineer: { access: 'view_only', note: 'Sanctioned load & consumer number verification' },
      installer: { access: 'restricted', note: 'Hidden: not required for hardware erection' }
    }
  },
  {
    category: 'Financial Deals, Revenue & Margins',
    description: 'Estimated quotation value, net contract price, profit margins, sales value',
    permissions: {
      admin: { access: 'full', note: 'Full executive visibility into P&L and pipeline value' },
      hr: { access: 'restricted', note: 'Strictly restricted — No access to client financial metrics' },
      sales: { access: 'full', note: 'Quotation negotiation and deal closure' },
      project_coordinator: { access: 'masked', note: 'Masked (••••••) — Confidential commercial pricing' },
      site_engineer: { access: 'masked', note: 'Masked (••••••) — Confidential commercial data' },
      installer: { access: 'masked', note: 'Masked (••••••) — Confidential commercial data' }
    }
  },
  {
    category: 'Customer Budget',
    description: 'Client spending ceiling and financing preference',
    permissions: {
      admin: { access: 'full', note: 'Budget oversight and discount approvals' },
      hr: { access: 'restricted', note: 'Hidden' },
      sales: { access: 'full', note: 'Sizing match and payment structuring' },
      project_coordinator: { access: 'restricted', note: 'Hidden' },
      site_engineer: { access: 'masked', note: 'Masked (••••••) — Not needed for technical CAD' },
      installer: { access: 'restricted', note: 'Hidden — Commercial detail' }
    }
  },
  {
    category: 'Site Survey, 3D Tilt & Roof CAD',
    description: 'Roof dimensions, usable area, tilt/azimuth angles, shadow analysis, drone photos',
    permissions: {
      admin: { access: 'full', note: 'Review feasibility reports' },
      hr: { access: 'restricted', note: 'Hidden' },
      sales: { access: 'view_only', note: 'View report summary to discuss with customer' },
      project_coordinator: { access: 'view_only', note: 'Verify site readiness before materials dispatch' },
      site_engineer: { access: 'full', note: 'Primary workspace: measurements & photo upload' },
      installer: { access: 'view_only', note: 'Reference structure layout & cable pathway' }
    }
  },
  {
    category: 'Quotations & Pricing Versions',
    description: 'System capacity, panel/inverter models, turnkey quotation, PDF proposals',
    permissions: {
      admin: { access: 'full', note: 'Edit, revise, approve, and track opens' },
      hr: { access: 'restricted', note: 'Hidden' },
      sales: { access: 'full', note: 'Generate quotes, revise pricing, send links' },
      project_coordinator: { access: 'restricted', note: 'Hidden — Only Bill of Materials (BOM) visible' },
      site_engineer: { access: 'view_only', note: 'Verify equipment BOM specifications' },
      installer: { access: 'restricted', note: 'Hidden — Only Bill of Materials (BOM) visible' }
    }
  },
  {
    category: '7-Stage Installation Checklist',
    description: 'Material dispatch, structure, panels, ACDB/DCDB wiring, inverter, testing & commissioning',
    permissions: {
      admin: { access: 'full', note: 'Milestone completion oversight' },
      hr: { access: 'restricted', note: 'Hidden' },
      sales: { access: 'view_only', note: 'Progress tracking for client communication' },
      project_coordinator: { access: 'full', note: 'Assign team, verify stage sign-offs, schedule milestones' },
      site_engineer: { access: 'view_only', note: 'Technical inspection and review' },
      installer: { access: 'full', note: 'Primary workspace: step sign-off & photo verification' }
    }
  },
  {
    category: 'Inventory Hardware & Stock',
    description: 'Tier-1 Mono PERC/TOPCon panels, string/micro inverters, mounting structures',
    permissions: {
      admin: { access: 'full', note: 'Stock levels, procurement cost & allocation' },
      hr: { access: 'restricted', note: 'Hidden' },
      sales: { access: 'view_only', note: 'Check stock availability for customer proposals' },
      project_coordinator: { access: 'full', note: 'Material dispatch to sites and inventory allocation' },
      site_engineer: { access: 'view_only', note: 'Verify panel wattage and inverter sizing' },
      installer: { access: 'full', note: 'Dispatch staging, site allocation & verification' }
    }
  },
  {
    category: 'Customer Payments & Milestone Invoices',
    description: 'Advance deposit, structure dispatch payment, net-metering dues, invoices',
    permissions: {
      admin: { access: 'full', note: 'Payment reconciliation, invoice issuance' },
      hr: { access: 'restricted', note: 'Hidden — Client accounting domain' },
      sales: { access: 'view_only', note: 'Follow up on pending client balance' },
      project_coordinator: { access: 'restricted', note: 'Hidden' },
      site_engineer: { access: 'restricted', note: 'Hidden' },
      installer: { access: 'restricted', note: 'Hidden' }
    }
  },
  {
    category: 'Audit Trail, System Backups & Import/Export',
    description: 'Change logs, CSV/Excel import/export, JSON system backups, lead reallocation',
    permissions: {
      admin: { access: 'full', note: 'System integrity, audit logging & data preservation' },
      hr: { access: 'restricted', note: 'Payroll export handled in Attendance module only' },
      sales: { access: 'restricted', note: 'Restricted' },
      project_coordinator: { access: 'restricted', note: 'Restricted' },
      site_engineer: { access: 'restricted', note: 'Restricted' },
      installer: { access: 'restricted', note: 'Restricted' }
    }
  }
];

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    roleName: 'Sneha Patel',
    roleTitle: 'Managing Director & EPC Head',
    department: 'Executive Management',
    allowedTabs: [
      'dashboard',
      'leads',
      'pipeline',
      'survey',
      'quotations',
      'delivery',
      'schedule',
      'aftersales',
      'automations',
      'calculator',
      'attendance'
    ],
    canViewFinancials: true,
    canViewCustomerBudget: true,
    canEditSurveys: true,
    canEditQuotations: true,
    canEditInstallation: true,
    canEditAutomations: true,
    canManageDataBackups: true,
    canExportData: true,
    canReassignLeads: true,
    canViewAuditTrail: true,
    canManageAttendance: true,
    roleDescription: 'Full administrative access across all solar EPC operations, financials, margins, attendance, and team settings.'
  },
  hr: {
    roleName: 'Pooja Nair',
    roleTitle: 'HR & People Operations Lead',
    department: 'Human Resources & Payroll',
    allowedTabs: [
      'dashboard',
      'attendance'
    ],
    canViewFinancials: false,
    canViewCustomerBudget: false,
    canEditSurveys: false,
    canEditQuotations: false,
    canEditInstallation: false,
    canEditAutomations: false,
    canManageDataBackups: false,
    canExportData: true, // For payroll Excel export
    canReassignLeads: false,
    canViewAuditTrail: true,
    canManageAttendance: true,
    roleDescription: 'HR desk: Attendance verification, GPS site punch validation, leave approvals, regularizations, and payroll export. No customer financial access.'
  },
  sales: {
    roleName: 'Ananya Sharma',
    roleTitle: 'Senior Solar Consultant',
    department: 'Sales & Business Development',
    allowedTabs: [
      'dashboard',
      'leads',
      'pipeline',
      'quotations',
      'calculator',
      'aftersales',
      'automations',
      'attendance'
    ],
    canViewFinancials: true,
    canViewCustomerBudget: true,
    canEditSurveys: false,
    canEditQuotations: true,
    canEditInstallation: false,
    canEditAutomations: true,
    canManageDataBackups: false,
    canExportData: false,
    canReassignLeads: false,
    canViewAuditTrail: false,
    canManageAttendance: false,
    roleDescription: 'Sales desk: Customer discovery, pipeline negotiations, proposal versions, and WhatsApp/email follow-ups.'
  },
  project_coordinator: {
    roleName: 'Rajesh Menon',
    roleTitle: 'Solar Project Coordinator & Site Logistics',
    department: 'Projects & Logistics',
    allowedTabs: [
      'dashboard',
      'schedule',
      'delivery',
      'pipeline',
      'survey',
      'calculator',
      'attendance'
    ],
    canViewFinancials: false,
    canViewCustomerBudget: false,
    canEditSurveys: false,
    canEditQuotations: false,
    canEditInstallation: true,
    canEditAutomations: false,
    canManageDataBackups: false,
    canExportData: false,
    canReassignLeads: false,
    canViewAuditTrail: false,
    canManageAttendance: true,
    roleDescription: 'Project coordinator: Team A & B scheduling, site team assignments, conflict resolution, labor hours tracking, and material logistics.'
  },
  site_engineer: {
    roleName: 'Vikram Rao',
    roleTitle: 'Lead Feasibility & CAD Surveyor',
    department: 'Technical & Engineering',
    allowedTabs: [
      'dashboard',
      'schedule',
      'survey',
      'leads',
      'calculator',
      'attendance'
    ],
    canViewFinancials: false,
    canViewCustomerBudget: false,
    canEditSurveys: true,
    canEditQuotations: false,
    canEditInstallation: false,
    canEditAutomations: false,
    canManageDataBackups: false,
    canExportData: false,
    canReassignLeads: false,
    canViewAuditTrail: false,
    canManageAttendance: false,
    roleDescription: 'Field engineering desk: 3D shadow analysis, roof structural measurements, and DISCOM net-meter feasibility.'
  },
  installer: {
    roleName: 'Kiran Verma',
    roleTitle: 'Lead Installation Supervisor',
    department: 'Projects & Commissioning',
    allowedTabs: [
      'dashboard',
      'schedule',
      'delivery',
      'aftersales',
      'attendance'
    ],
    canViewFinancials: false,
    canViewCustomerBudget: false,
    canEditSurveys: false,
    canEditQuotations: false,
    canEditInstallation: true,
    canEditAutomations: false,
    canManageDataBackups: false,
    canExportData: false,
    canReassignLeads: false,
    canViewAuditTrail: false,
    canManageAttendance: false,
    roleDescription: 'Field erection & electrical crew: Team A supervisor, 7-stage site checklist, photo verification, and hardware stock.'
  }
};

export function isTabAllowed(role: UserRole, tab: MainNavTab): boolean {
  return ROLE_PERMISSIONS[role].allowedTabs.includes(tab);
}

export function canViewFinancials(role: UserRole): boolean {
  return ROLE_PERMISSIONS[role].canViewFinancials;
}

export function canViewBudget(role: UserRole): boolean {
  return ROLE_PERMISSIONS[role].canViewCustomerBudget;
}

export function maskFinancialValue(value: string | number, role: UserRole): string {
  if (canViewFinancials(role)) {
    return typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value;
  }
  return '₹ •••••• (Restricted)';
}

export function getDefaultTabForRole(role: UserRole): MainNavTab {
  switch (role) {
    case 'hr':
      return 'attendance';
    case 'project_coordinator':
      return 'delivery';
    case 'site_engineer':
      return 'survey';
    case 'installer':
      return 'delivery';
    case 'sales':
      return 'pipeline';
    case 'admin':
    default:
      return 'dashboard';
  }
}
