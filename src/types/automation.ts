export interface EmailStep {
  stepNumber: number;
  delayDays: number;
  delayLabel: string;
  subject: string;
  bodyTemplate: string;
}

export interface EmailSequence {
  id: string;
  title: string;
  category: 'Lead Nurture' | 'Audit Confirmation' | 'Proposal Close' | 'Subsidy & Onboarding' | 'Post-Commissioning';
  triggerEvent: string;
  description: string;
  active: boolean;
  enrollCount: number;
  openRatePercent: number;
  clickRatePercent: number;
  steps: EmailStep[];
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  triggerCategory: 'Lead Welcome' | 'Site Visit Reminder' | 'Proposal Link' | 'Subsidy Sanction' | 'Payment Reminder' | 'Cleaning Reminder';
  content: string;
  variables: string[];
}

export interface SmsTemplate {
  id: string;
  title: string;
  dltTemplateId: string;
  text: string;
}

export interface AutoAssignmentRule {
  id: string;
  name: string;
  strategy: 'Round-Robin' | 'City/State Territory' | 'System Size Load';
  territories?: string[];
  active: boolean;
  assignedReps: string[];
}
