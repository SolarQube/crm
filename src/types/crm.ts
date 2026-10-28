export type UserRole = 
  | 'admin' 
  | 'hr' 
  | 'sales' 
  | 'project_coordinator' 
  | 'site_engineer' 
  | 'installer';

export type CustomerType = 'residential' | 'commercial' | 'industrial' | 'agricultural';

export type PropertyType = 
  | 'Home / Villa'
  | 'Commercial / Office'
  | 'Factory / Industrial Shed'
  | 'Farm / Agricultural Pump'
  | 'Residential Society (Common Area)';

export type PipelineStage = 
  | 'new'
  | 'contacted'
  | 'site_survey'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost';

export type LeadSource = 
  | 'Website Form'
  | 'WhatsApp Inbound'
  | 'Phone Call'
  | 'Expo & Event'
  | 'Customer Referral'
  | 'Facebook Ad'
  | 'Google Ad'
  | 'Field Survey';

export type LostReason = 
  | 'Price too high / Competitor cheaper'
  | 'DISCOM load sanction rejected'
  | 'Customer postponed / Budget deferred'
  | 'Roof structural issues / Severe shading'
  | 'Bank solar loan rejected'
  | 'Decided not to go solar'
  | 'Other';

export type RoofType = 'RCC Flat Roof' | 'Metal Sheet Shed' | 'Tiled Slanted' | 'Ground Mount';

export type SystemType = 'On-Grid' | 'Hybrid with Storage' | 'Off-Grid';

export interface ActivityLog {
  id: string;
  type: 'call' | 'note' | 'whatsapp' | 'email' | 'meeting' | 'site_visit' | 'stage_change';
  author: string;
  role: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  type: 'Call' | 'Site Visit' | 'Send Revised Quote' | 'DISCOM Verification' | 'Payment Follow-up';
  dueDate: string;
  dueTime?: string;
  assignedTo: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ProposalVersion {
  id: string;
  versionNumber: string;
  systemSizeKw: number;
  panelBrand: string;
  inverterBrand: string;
  structureType: string;
  grossPrice: number;
  subsidyAmount: number;
  netPrice: number;
  annualSavings: number;
  paybackYears: number;
  createdDate: string;
  status: 'Draft' | 'Sent' | 'Viewed by Customer' | 'Accepted' | 'Revised';
  openedCount: number;
}

export interface SiteSurveyData {
  scheduledDate: string;
  engineerName: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  roofLengthFt: number;
  roofWidthFt: number;
  usableAreaSqFt: number;
  tiltAngleDeg: number;
  azimuthAngleDeg: number;
  shadingAssessment: 'Nil (0-2%)' | 'Low (<5%)' | 'Moderate (5-15%)' | 'Severe (>15%)';
  roofCondition: 'Excellent' | 'Good' | 'Needs Reinforcement';
  meterType: 'Single Phase LT' | 'Three Phase LT' | 'HT 11kV';
  sanctionedLoadKw: number;
  photos: Array<{ id: string; url: string; caption: string; date: string }>;
  notes: string;
}

export interface SubsidyAndNetMetering {
  consumerNumber: string;
  discomName: string;
  nationalPortalAppNumber: string;
  nationalPortalStatus: 'Pending' | 'Applied' | 'Feasibility Approved' | 'Inspection Completed' | 'Subsidy Disbursed';
  discomSanctionStatus: 'Not Applied' | 'Application Submitted' | 'Sanction Issued' | 'Net-Meter Installed';
  sanctionLetterNumber?: string;
  netMeterInstalledDate?: string;
}

export interface StoredDocument {
  id: string;
  name: string;
  category: 'Electricity Bill' | 'Aadhaar / ID' | 'Roof Photo' | 'DISCOM Sanction' | 'Agreement' | 'Invoice';
  uploadDate: string;
  fileSize: string;
  url?: string;
}

export interface InstallationChecklistStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedDate?: string;
  assignedTeam: string;
  photoUploaded: boolean;
  photoUrl?: string;
}

export interface PaymentMilestone {
  id: string;
  title: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  invoiceNumber?: string;
}

export interface ServiceTicket {
  id: string;
  leadId: string;
  customerName: string;
  systemSizeKw: number;
  issueCategory: 'Inverter Tripping' | 'Generation Low' | 'Panel Cleaning Due' | 'Monitoring App Offline' | 'DISCOM Net-Meter Discrepancy';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Technician Dispatched' | 'Resolved';
  createdDate: string;
  assignedEngineer: string;
  notes: string;
  warrantyPanelStatus: 'Valid (25-Yr Linear)' | 'Expired';
  warrantyInverterStatus: 'Valid (5-Yr)' | 'Expired';
}

export interface CustomerReferral {
  id: string;
  referrerLeadId: string;
  referrerName: string;
  referredCustomerName: string;
  referredPhone: string;
  systemSizeKw: number;
  status: 'In Discussion' | 'Project Won' | 'Incentive Disbursed';
  incentiveAmount: number;
}

export interface InventoryItem {
  id: string;
  category: 'Solar Panels' | 'Inverters' | 'Mounting Structures' | 'BOS & Cables';
  brandModel: string;
  specification: string;
  unit: string;
  totalStock: number;
  allocatedForProjects: number;
  availableStock: number;
  unitCost: number;
}

export interface SentEmail {
  id: string;
  sequenceTitle?: string;
  subject: string;
  sender: string;
  recipient: string;
  sentAt: string;
  status: 'Delivered' | 'Opened' | 'Clicked' | 'Replied';
  snippet: string;
  body: string;
}

export interface SolarLead {
  id: string;
  customerName: string;
  companyOrSocietyName?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  customerType?: CustomerType;
  monthlyBill: number;
  roofAreaSqFt: number;
  roofType: RoofType;
  systemType: SystemType;
  customerBudget?: number;
  recommendedCapacityKw: number;
  estimatedQuoteValue: number;
  estimatedSubsidyAmount: number;
  netPayableAmount: number;
  estimatedAnnualSavings?: number;
  estimatedPaybackYears?: number;
  
  // Pipeline
  stage: PipelineStage;
  lostReason?: LostReason;
  lostNotes?: string;
  priority: 'High' | 'Medium' | 'Low';
  source: LeadSource;
  assignedTo: string;
  
  // Timestamps
  createdDate: string;
  lastContactedDate: string;
  nextFollowUpDate: string;
  untouchedAlert: boolean;

  // Sub-modules
  activities: ActivityLog[];
  siteSurvey?: SiteSurveyData;
  siteAuditDetails?: SiteSurveyData;
  proposals: ProposalVersion[];
  subsidyTracker?: SubsidyAndNetMetering;
  documents: StoredDocument[];
  installationSteps: InstallationChecklistStep[];
  payments: PaymentMilestone[];
  emailHistory?: SentEmail[];
}

export interface AuditTrailLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
}
