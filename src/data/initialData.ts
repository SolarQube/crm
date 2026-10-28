import { 
  SolarLead, 
  PipelineStage, 
  FollowUpTask, 
  InventoryItem, 
  ServiceTicket, 
  CustomerReferral, 
  AuditTrailLog 
} from '../types/crm';
import { WhatsAppTemplate, AutoAssignmentRule } from '../types/automation';

export const PIPELINE_STAGES: { id: PipelineStage; title: string; shortLabel: string; order: number }[] = [
  { id: 'new', title: 'New Inbound', shortLabel: 'New', order: 1 },
  { id: 'contacted', title: 'Contacted & Discovery', shortLabel: 'Contacted', order: 2 },
  { id: 'site_survey', title: 'Site Survey & Audit', shortLabel: 'Site Survey', order: 3 },
  { id: 'proposal_sent', title: 'Proposal & ROI Sent', shortLabel: 'Proposal Sent', order: 4 },
  { id: 'negotiation', title: 'Negotiation & Financing', shortLabel: 'Negotiation', order: 5 },
  { id: 'won', title: 'Project Won', shortLabel: 'Won', order: 6 },
  { id: 'lost', title: 'Lost Deal', shortLabel: 'Lost', order: 7 }
];

export const TEAM_MEMBERS = [
  { name: 'Sneha Patel', role: 'admin', title: 'Managing Director / EPC Admin', email: 'sneha@solarqubeenergy.in', phone: '+91 98450 11001' },
  { name: 'Pooja Nair', role: 'hr', title: 'HR & People Operations Lead', email: 'pooja.nair@solarqubeenergy.in', phone: '+91 98450 55005' },
  { name: 'Ananya Sharma', role: 'sales', title: 'Senior Solar Sales Consultant', email: 'ananya.sharma@solarqubeenergy.in', phone: '+91 98450 22002' },
  { name: 'Rajesh Menon', role: 'project_coordinator', title: 'Solar Project Coordinator & Site Logistics', email: 'rajesh.menon@solarqubeenergy.in', phone: '+91 98450 66006' },
  { name: 'Vikram Rao', role: 'site_engineer', title: 'Chief Solar Design & Survey Engineer', email: 'vikram.rao@solarqubeenergy.in', phone: '+91 98450 33003' },
  { name: 'Kiran Verma', role: 'installer', title: 'Lead Electrical & Installation Supervisor', email: 'kiran.verma@solarqubeenergy.in', phone: '+91 98450 44004' }
];

export const INITIAL_LEADS: SolarLead[] = [
  {
    id: 'sq-201',
    customerName: 'Dr. Arvind Rao',
    companyOrSocietyName: 'Green Meadows Villa 42',
    phone: '+91 98450 12890',
    email: 'arvind.rao.blr@gmail.com',
    address: 'Plot 42, Green Meadows Enclave, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    propertyType: 'Home / Villa',
    monthlyBill: 14500,
    roofAreaSqFt: 1400,
    roofType: 'RCC Flat Roof',
    systemType: 'On-Grid',
    customerBudget: 550000,
    recommendedCapacityKw: 10,
    estimatedQuoteValue: 580000,
    estimatedSubsidyAmount: 78000,
    netPayableAmount: 502000,
    stage: 'negotiation',
    priority: 'High',
    source: 'Website Form',
    assignedTo: 'Ananya Sharma',
    createdDate: '2026-10-10',
    lastContactedDate: '2026-10-19',
    nextFollowUpDate: '2026-10-21',
    untouchedAlert: false,
    activities: [
      {
        id: 'act-1',
        type: 'stage_change',
        author: 'Ananya Sharma',
        role: 'sales',
        title: 'Moved to Negotiation',
        description: 'Customer reviewed proposal v1.1 with Waaree 550Wp bifacial modules. Negotiating 5-yr AMC inclusion.',
        timestamp: '2026-10-19 14:30'
      },
      {
        id: 'act-2',
        type: 'call',
        author: 'Ananya Sharma',
        role: 'sales',
        title: 'Discussed PM Surya Ghar Portal Direct Subsidy',
        description: 'Explained that ₹78,000 DBT will be deposited directly to his bank account post net-meter energization.',
        timestamp: '2026-10-18 11:15'
      }
    ],
    siteSurvey: {
      scheduledDate: '2026-10-14',
      engineerName: 'Vikram Rao',
      status: 'Completed',
      roofLengthFt: 40,
      roofWidthFt: 35,
      usableAreaSqFt: 1250,
      tiltAngleDeg: 13,
      azimuthAngleDeg: 180,
      shadingAssessment: 'Nil (0-2%)',
      roofCondition: 'Excellent',
      meterType: 'Three Phase LT',
      sanctionedLoadKw: 12,
      photos: [
        { id: 'p1', url: '/src/assets/images/solar_residential_villa_1792499437378.jpg', caption: 'South-facing unobstructed RCC terrace', date: '2026-10-14' }
      ],
      notes: 'Elevated 7ft HDGI walk-under structure recommended so homeowner preserves terrace space for sit-out.'
    },
    proposals: [
      {
        id: 'pr-101-1',
        versionNumber: 'v1.0',
        systemSizeKw: 10,
        panelBrand: 'Waaree 550Wp Mono PERC',
        inverterBrand: 'Growatt 10kVA On-Grid',
        structureType: 'Standard HDGI Rails',
        grossPrice: 595000,
        subsidyAmount: 78000,
        netPrice: 517000,
        annualSavings: 127500,
        paybackYears: 4.0,
        createdDate: '2026-10-15',
        status: 'Revised',
        openedCount: 4
      },
      {
        id: 'pr-101-2',
        versionNumber: 'v1.1',
        systemSizeKw: 10,
        panelBrand: 'Waaree 550Wp TOPCon Bifacial Glass-to-Glass',
        inverterBrand: 'Growatt 10kVA Dual MPPT',
        structureType: 'Elevated 7ft Walk-Under HDGI Structure',
        grossPrice: 580000,
        subsidyAmount: 78000,
        netPrice: 502000,
        annualSavings: 132000,
        paybackYears: 3.8,
        createdDate: '2026-10-17',
        status: 'Viewed by Customer',
        openedCount: 7
      }
    ],
    subsidyTracker: {
      consumerNumber: 'BESCOM-9481920',
      discomName: 'BESCOM',
      nationalPortalAppNumber: 'SURYA-KA-2026-8812',
      nationalPortalStatus: 'Feasibility Approved',
      discomSanctionStatus: 'Sanction Issued',
      sanctionLetterNumber: 'BESCOM/WFD/SOLAR/4412/2026'
    },
    documents: [
      { id: 'doc-1', name: 'BESCOM_Electricity_Bill_Aug2026.pdf', category: 'Electricity Bill', uploadDate: '2026-10-11', fileSize: '1.2 MB' },
      { id: 'doc-2', name: 'Aadhaar_Card_ArvindRao.pdf', category: 'Aadhaar / ID', uploadDate: '2026-10-11', fileSize: '850 KB' },
      { id: 'doc-3', name: 'BESCOM_NetMetering_Feasibility_Letter.pdf', category: 'DISCOM Sanction', uploadDate: '2026-10-18', fileSize: '1.8 MB' }
    ],
    installationSteps: [
      { id: 'step-1', title: 'BOS & PV Module Dispatch to Site', description: 'Modules, inverter, and structures delivered', completed: false, assignedTeam: 'Logistics Fleet 2', photoUploaded: false },
      { id: 'step-2', title: 'Elevated HDGI Structure Erection', description: 'Base anchor bolting and chemical grouting', completed: false, assignedTeam: 'Fabrication Team A', photoUploaded: false },
      { id: 'step-3', title: 'Solar Panel Clamping & Fastening', description: '18x Waaree 550W TOPCon bifacial modules', completed: false, assignedTeam: 'Kiran Verma Installer Team', photoUploaded: false },
      { id: 'step-4', title: 'DC Cabling & Surge Protection Earthing', description: 'Dual chemical earthing pits & lightning rod', completed: false, assignedTeam: 'Electrical Team B', photoUploaded: false },
      { id: 'step-5', title: 'Inverter Mounting & AC Distribution Box', description: 'Growatt 10kVA with SPD Type 2 integration', completed: false, assignedTeam: 'Kiran Verma Installer Team', photoUploaded: false },
      { id: 'step-6', title: 'Pre-Commissioning Insulation & Megger Testing', description: 'VOC, ISC, and string polarity check', completed: false, assignedTeam: 'Vikram Rao (Engineer)', photoUploaded: false },
      { id: 'step-7', title: 'DISCOM Bi-Directional Net-Meter Energization', description: 'BESCOM test bench seal and meter turn-on', completed: false, assignedTeam: 'Liaisoning Desk', photoUploaded: false }
    ],
    payments: [
      { id: 'pay-1', title: 'Advance 20% on EPC Contract Signing', amount: 100400, status: 'Pending', dueDate: '2026-10-22', invoiceNumber: 'SQ-INV-2026-091' },
      { id: 'pay-2', title: 'Milestone 60% on Material Dispatch & Structure', amount: 301200, status: 'Pending', dueDate: '2026-10-29' },
      { id: 'pay-3', title: 'Final 20% on Net-Meter Energization & Handover', amount: 100400, status: 'Pending', dueDate: '2026-11-12' }
    ]
  },
  {
    id: 'sq-202',
    customerName: 'Kailash Singhania',
    companyOrSocietyName: 'Zenith Logistics Hub',
    phone: '+91 98201 54321',
    email: 'kailash.s@zenithlogistics.in',
    address: 'Sector 4, Poman Logistics Hub, Mumbai-Nashik Expressway',
    city: 'Bhiwandi',
    state: 'Maharashtra',
    propertyType: 'Factory / Industrial Shed',
    monthlyBill: 165000,
    roofAreaSqFt: 18000,
    roofType: 'Metal Sheet Shed',
    systemType: 'On-Grid',
    customerBudget: 5000000,
    recommendedCapacityKw: 120,
    estimatedQuoteValue: 5280000,
    estimatedSubsidyAmount: 0,
    netPayableAmount: 5280000,
    stage: 'site_survey',
    priority: 'High',
    source: 'Customer Referral',
    assignedTo: 'Vikram Rao',
    createdDate: '2026-10-15',
    lastContactedDate: '2026-10-18',
    nextFollowUpDate: '2026-10-22',
    untouchedAlert: false,
    activities: [
      {
        id: 'act-3',
        type: 'site_visit',
        author: 'Vikram Rao',
        role: 'site_engineer',
        title: 'Roof Structural Feasibility & Purlin Scan',
        description: 'Conducted drone survey of 18,000 sq.ft trapezoidal sheet shed. Verified purlin spacing (1.2m) allows direct non-penetrative aluminium clamp rail mounting.',
        timestamp: '2026-10-18 15:00'
      }
    ],
    siteSurvey: {
      scheduledDate: '2026-10-22',
      engineerName: 'Vikram Rao',
      status: 'In Progress',
      roofLengthFt: 180,
      roofWidthFt: 100,
      usableAreaSqFt: 16000,
      tiltAngleDeg: 8,
      azimuthAngleDeg: 195,
      shadingAssessment: 'Nil (0-2%)',
      roofCondition: 'Good',
      meterType: 'HT 11kV',
      sanctionedLoadKw: 150,
      photos: [
        { id: 'p2', url: '/src/assets/images/solar_rooftop_commercial_1792499437891.jpg', caption: 'Trapezoidal metal roof with zero shading', date: '2026-10-18' }
      ],
      notes: 'Transformer capacity check confirmed 200kVA transformer has sufficient headroom for 120kW export.'
    },
    proposals: [
      {
        id: 'pr-202-1',
        versionNumber: 'v1.0',
        systemSizeKw: 120,
        panelBrand: 'Adani Solar 550Wp Bifacial',
        inverterBrand: 'Sungrow 110kVA String Inverter',
        structureType: 'Non-Penetrative Aluminium Mini-Rail Clamps',
        grossPrice: 5280000,
        subsidyAmount: 0,
        netPrice: 5280000,
        annualSavings: 1584000,
        paybackYears: 3.3,
        createdDate: '2026-10-19',
        status: 'Sent',
        openedCount: 2
      }
    ],
    subsidyTracker: {
      consumerNumber: 'MSEDCL-HT-088192',
      discomName: 'MSEDCL',
      nationalPortalAppNumber: 'N/A (C&I Commercial)',
      nationalPortalStatus: 'Pending',
      discomSanctionStatus: 'Application Submitted'
    },
    documents: [
      { id: 'doc-4', name: 'MSEDCL_HT_Bill_September.pdf', category: 'Electricity Bill', uploadDate: '2026-10-16', fileSize: '2.4 MB' },
      { id: 'doc-5', name: 'Zenith_Structural_Stability_Certificate.pdf', category: 'Roof Photo', uploadDate: '2026-10-17', fileSize: '3.1 MB' }
    ],
    installationSteps: [],
    payments: []
  },
  {
    id: 'sq-203',
    customerName: 'Suresh Patil',
    companyOrSocietyName: 'Patil Agro Farm & Cold Storage',
    phone: '+91 94220 77112',
    email: 'suresh.patil.agro@gmail.com',
    address: 'Gat No. 114, Baramati-Phaltan Road',
    city: 'Baramati',
    state: 'Maharashtra',
    propertyType: 'Farm / Agricultural Pump',
    monthlyBill: 34000,
    roofAreaSqFt: 4500,
    roofType: 'Ground Mount',
    systemType: 'Hybrid with Storage',
    customerBudget: 1100000,
    recommendedCapacityKw: 25,
    estimatedQuoteValue: 1250000,
    estimatedSubsidyAmount: 0,
    netPayableAmount: 1250000,
    stage: 'contacted',
    priority: 'Medium',
    source: 'WhatsApp Inbound',
    assignedTo: 'Ananya Sharma',
    createdDate: '2026-10-17',
    lastContactedDate: '2026-10-18',
    nextFollowUpDate: '2026-10-21',
    untouchedAlert: false,
    activities: [
      {
        id: 'act-4',
        type: 'whatsapp',
        author: 'Ananya Sharma',
        role: 'sales',
        title: 'Sent Solar Water Pump & Cold Storage Sizing Guide',
        description: 'Customer inquired via WhatsApp about running 15 HP irrigation pump and 10 ton fruit pre-cooler on solar.',
        timestamp: '2026-10-18 09:30'
      }
    ],
    proposals: [],
    documents: [],
    installationSteps: [],
    payments: []
  },
  {
    id: 'sq-204',
    customerName: 'Preeti Deshpande',
    companyOrSocietyName: 'Preeti Villa',
    phone: '+91 97664 33201',
    email: 'preeti.deshpande@rediffmail.com',
    address: '12 Sahakar Nagar, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    propertyType: 'Home / Villa',
    monthlyBill: 6200,
    roofAreaSqFt: 750,
    roofType: 'RCC Flat Roof',
    systemType: 'On-Grid',
    customerBudget: 220000,
    recommendedCapacityKw: 4,
    estimatedQuoteValue: 248000,
    estimatedSubsidyAmount: 78000,
    netPayableAmount: 170000,
    stage: 'new',
    priority: 'High',
    source: 'Google Ad',
    assignedTo: 'Ananya Sharma',
    createdDate: '2026-10-17',
    lastContactedDate: '2026-10-17',
    nextFollowUpDate: '2026-10-19',
    untouchedAlert: true, // Untouched > 48 hours!
    activities: [
      {
        id: 'act-5',
        type: 'stage_change',
        author: 'Google Ads Webhook',
        role: 'admin',
        title: 'Inbound Lead Generated',
        description: 'Lead captured from "Pune Rooftop Solar Subsidy" Google Search Campaign. Untouched for 72 hours - requires urgent follow-up.',
        timestamp: '2026-10-17 08:20'
      }
    ],
    proposals: [],
    documents: [],
    installationSteps: [],
    payments: []
  },
  {
    id: 'sq-205',
    customerName: 'Anil & Shalini Bansal',
    companyOrSocietyName: 'Bansal Heights Resident Society',
    phone: '+91 98110 33451',
    email: 'bansal.anil@yahoo.co.in',
    address: 'Sector 50, Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    propertyType: 'Residential Society (Common Area)',
    monthlyBill: 22000,
    roofAreaSqFt: 2200,
    roofType: 'RCC Flat Roof',
    systemType: 'On-Grid',
    customerBudget: 850000,
    recommendedCapacityKw: 15,
    estimatedQuoteValue: 870000,
    estimatedSubsidyAmount: 78000,
    netPayableAmount: 792000,
    stage: 'won',
    priority: 'High',
    source: 'Facebook Ad',
    assignedTo: 'Sneha Patel',
    createdDate: '2026-09-10',
    lastContactedDate: '2026-10-15',
    nextFollowUpDate: '2026-11-15',
    untouchedAlert: false,
    activities: [
      {
        id: 'act-6',
        type: 'stage_change',
        author: 'Sneha Patel',
        role: 'admin',
        title: 'Project Energized & Commissioned',
        description: 'Net meter synchronization completed by PVVNL. System generating ~68 units/day. Handover certificate signed.',
        timestamp: '2026-10-15 16:00'
      }
    ],
    siteSurvey: {
      scheduledDate: '2026-09-14',
      engineerName: 'Vikram Rao',
      status: 'Completed',
      roofLengthFt: 55,
      roofWidthFt: 40,
      usableAreaSqFt: 2000,
      tiltAngleDeg: 28,
      azimuthAngleDeg: 180,
      shadingAssessment: 'Nil (0-2%)',
      roofCondition: 'Excellent',
      meterType: 'Three Phase LT',
      sanctionedLoadKw: 20,
      photos: [],
      notes: 'Terrace parapet is low. South horizon has zero shadow.'
    },
    proposals: [
      {
        id: 'pr-205-1',
        versionNumber: 'v1.0',
        systemSizeKw: 15,
        panelBrand: 'Tata Power Solar 550Wp Mono PERC',
        inverterBrand: 'Solis 15kVA On-Grid Inverter',
        structureType: 'Elevated Super-Structure HDGI',
        grossPrice: 870000,
        subsidyAmount: 78000,
        netPrice: 792000,
        annualSavings: 182000,
        paybackYears: 4.3,
        createdDate: '2026-09-18',
        status: 'Accepted',
        openedCount: 12
      }
    ],
    subsidyTracker: {
      consumerNumber: 'PVVNL-892019',
      discomName: 'PVVNL',
      nationalPortalAppNumber: 'SURYA-UP-2026-1192',
      nationalPortalStatus: 'Subsidy Disbursed',
      discomSanctionStatus: 'Net-Meter Installed',
      sanctionLetterNumber: 'PVVNL/NOIDA/NETMET/2026-90',
      netMeterInstalledDate: '2026-10-14'
    },
    documents: [
      { id: 'doc-6', name: 'Signed_EPC_Contract_Bansal.pdf', category: 'Agreement', uploadDate: '2026-09-22', fileSize: '3.4 MB' },
      { id: 'doc-7', name: 'PVVNL_NetMeter_Energization_Report.pdf', category: 'DISCOM Sanction', uploadDate: '2026-10-14', fileSize: '1.9 MB' },
      { id: 'doc-8', name: 'SolarQube_Handover_Invoice_Final.pdf', category: 'Invoice', uploadDate: '2026-10-15', fileSize: '1.1 MB' }
    ],
    installationSteps: [
      { id: 'step-1', title: 'BOS & PV Module Dispatch to Site', description: '27x Tata Power Solar modules delivered', completed: true, completedDate: '2026-09-28', assignedTeam: 'Logistics Fleet 1', photoUploaded: true },
      { id: 'step-2', title: 'Elevated HDGI Structure Erection', description: 'Civil foundation curing and torque inspection', completed: true, completedDate: '2026-10-02', assignedTeam: 'Fabrication Team A', photoUploaded: true },
      { id: 'step-3', title: 'Solar Panel Clamping & Fastening', description: 'Mid-clamps and end-clamps torqued to 12 Nm', completed: true, completedDate: '2026-10-05', assignedTeam: 'Kiran Verma Installer Team', photoUploaded: true },
      { id: 'step-4', title: 'DC Cabling & Surge Protection Earthing', description: 'Cu-bonded chemical earthing pits tested < 2 ohms', completed: true, completedDate: '2026-10-08', assignedTeam: 'Electrical Team B', photoUploaded: true },
      { id: 'step-5', title: 'Inverter Mounting & AC Distribution Box', description: 'Solis 15kVA connected with smart WiFi logger', completed: true, completedDate: '2026-10-10', assignedTeam: 'Kiran Verma Installer Team', photoUploaded: true },
      { id: 'step-6', title: 'Pre-Commissioning Insulation & Megger Testing', description: 'Passed electrical safety inspection', completed: true, completedDate: '2026-10-12', assignedTeam: 'Vikram Rao (Engineer)', photoUploaded: true },
      { id: 'step-7', title: 'DISCOM Bi-Directional Net-Meter Energization', description: 'Net meter installed & bi-directional sync verified', completed: true, completedDate: '2026-10-14', assignedTeam: 'Liaisoning Desk', photoUploaded: true }
    ],
    payments: [
      { id: 'pay-4', title: '20% Advance on Booking', amount: 158400, status: 'Paid', dueDate: '2026-09-22', paidDate: '2026-09-22', invoiceNumber: 'SQ-INV-2026-055' },
      { id: 'pay-5', title: '60% Milestone on Material Dispatch', amount: 475200, status: 'Paid', dueDate: '2026-09-28', paidDate: '2026-09-29', invoiceNumber: 'SQ-INV-2026-068' },
      { id: 'pay-6', title: '20% Final on Energization', amount: 158400, status: 'Paid', dueDate: '2026-10-15', paidDate: '2026-10-15', invoiceNumber: 'SQ-INV-2026-088' }
    ]
  },
  {
    id: 'sq-206',
    customerName: 'Dheeraj Mehta',
    companyOrSocietyName: 'Mehta Textile Processing',
    phone: '+91 98250 88291',
    email: 'dheeraj@mehtatextiles.com',
    address: 'GIDC Industrial Estate, Naroda',
    city: 'Ahmedabad',
    state: 'Gujarat',
    propertyType: 'Factory / Industrial Shed',
    monthlyBill: 210000,
    roofAreaSqFt: 15000,
    roofType: 'Metal Sheet Shed',
    systemType: 'On-Grid',
    customerBudget: 4200000,
    recommendedCapacityKw: 150,
    estimatedQuoteValue: 6600000,
    estimatedSubsidyAmount: 0,
    netPayableAmount: 6600000,
    stage: 'lost',
    lostReason: 'Price too high / Competitor cheaper',
    lostNotes: 'Client opted for local Gujarat EPC offering tier-2 polycrystalline modules at ₹38/watt. We maintain Tier-1 TopCon DCR standard.',
    priority: 'Low',
    source: 'Expo & Event',
    assignedTo: 'Ananya Sharma',
    createdDate: '2026-09-15',
    lastContactedDate: '2026-10-05',
    nextFollowUpDate: '2027-01-15',
    untouchedAlert: false,
    activities: [
      {
        id: 'act-7',
        type: 'stage_change',
        author: 'Ananya Sharma',
        role: 'sales',
        title: 'Deal Marked as Lost',
        description: 'Lost to cheaper local competitor using uncertified modules. Client declined 25-yr degradation guarantee.',
        timestamp: '2026-10-05 17:30'
      }
    ],
    proposals: [],
    documents: [],
    installationSteps: [],
    payments: []
  }
];

export const INITIAL_TASKS: FollowUpTask[] = [
  {
    id: 'tsk-1',
    leadId: 'sq-204',
    leadName: 'Preeti Deshpande (4 kWp Pune)',
    title: 'Urgent Initial Discovery Call & Sizing Qualification',
    type: 'Call',
    dueDate: '2026-10-20',
    dueTime: '11:00 AM',
    assignedTo: 'Ananya Sharma',
    completed: false,
    priority: 'High'
  },
  {
    id: 'tsk-2',
    leadId: 'sq-201',
    leadName: 'Dr. Arvind Rao (10 kWp Whitefield)',
    title: 'Site Visit: Present Final Proposal v1.1 & Walk-Under HDGI Layout',
    type: 'Site Visit',
    dueDate: '2026-10-21',
    dueTime: '03:30 PM',
    assignedTo: 'Ananya Sharma',
    completed: false,
    priority: 'High'
  },
  {
    id: 'tsk-3',
    leadId: 'sq-202',
    leadName: 'Zenith Logistics Hub (120 kWp Bhiwandi)',
    title: 'Follow-up with MSEDCL HT Substation on Feasibility NOC',
    type: 'DISCOM Verification',
    dueDate: '2026-10-22',
    dueTime: '02:00 PM',
    assignedTo: 'Vikram Rao',
    completed: false,
    priority: 'Medium'
  },
  {
    id: 'tsk-4',
    leadId: 'sq-203',
    leadName: 'Suresh Patil (25 kWp Agro Baramati)',
    title: 'Send Solar Irrigation Hybrid Battery Storage Proposal',
    type: 'Send Revised Quote',
    dueDate: '2026-10-21',
    dueTime: '05:00 PM',
    assignedTo: 'Ananya Sharma',
    completed: false,
    priority: 'Medium'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    category: 'Solar Panels',
    brandModel: 'Waaree Bi-55 TOPCon Bifacial 550Wp',
    specification: 'Tier-1 Glass-to-Glass, DCR Compliant, 144 Half-Cells',
    unit: 'Modules',
    totalStock: 350,
    allocatedForProjects: 180,
    availableStock: 170,
    unitCost: 11500
  },
  {
    id: 'inv-2',
    category: 'Solar Panels',
    brandModel: 'Adani Solar Bifacial 550Wp Mono PERC',
    specification: 'ALMM Listed, 21.3% Efficiency, IP68 Junction Box',
    unit: 'Modules',
    totalStock: 400,
    allocatedForProjects: 220,
    availableStock: 180,
    unitCost: 11000
  },
  {
    id: 'inv-3',
    category: 'Inverters',
    brandModel: 'Growatt MIN 10000TL-X Smart Inverter',
    specification: '10kVA Three-Phase, Dual MPPT, WiFi Data Logger',
    unit: 'Units',
    totalStock: 14,
    allocatedForProjects: 6,
    availableStock: 8,
    unitCost: 72000
  },
  {
    id: 'inv-4',
    category: 'Inverters',
    brandModel: 'Sungrow SG110CX Commercial Inverter',
    specification: '110kVA On-Grid, 9 MPPTs, Built-in PID recovery',
    unit: 'Units',
    totalStock: 4,
    allocatedForProjects: 2,
    availableStock: 2,
    unitCost: 385000
  },
  {
    id: 'inv-5',
    category: 'Mounting Structures',
    brandModel: 'Hot-Dip Galvanized Iron (HDGI) Elevated Rails (80 Micron)',
    specification: 'Wind speed rated 160 km/h, SS304 A2-70 Fasteners',
    unit: 'Sets (kW)',
    totalStock: 300,
    allocatedForProjects: 145,
    availableStock: 155,
    unitCost: 4500
  },
  {
    id: 'inv-6',
    category: 'BOS & Cables',
    brandModel: 'Solar DC Cable 4 sq.mm (Siechem / Polycab)',
    specification: 'TUV Rheinland Certified, XLPO Insulation, 1.5kV DC',
    unit: 'Meters',
    totalStock: 5000,
    allocatedForProjects: 2800,
    availableStock: 2200,
    unitCost: 48
  }
];

export const INITIAL_SERVICE_TICKETS: ServiceTicket[] = [
  {
    id: 'tkt-1',
    leadId: 'sq-205',
    customerName: 'Anil Bansal (Bansal Heights)',
    systemSizeKw: 15,
    issueCategory: 'Panel Cleaning Due',
    priority: 'Medium',
    status: 'Open',
    createdDate: '2026-10-18',
    assignedEngineer: 'Kiran Verma',
    notes: 'Quarterly AMC panel deep cleaning and dust desoiling scheduled for this Saturday.',
    warrantyPanelStatus: 'Valid (25-Yr Linear)',
    warrantyInverterStatus: 'Valid (5-Yr)'
  },
  {
    id: 'tkt-2',
    leadId: 'sq-205',
    customerName: 'Anil Bansal (Bansal Heights)',
    systemSizeKw: 15,
    issueCategory: 'Monitoring App Offline',
    priority: 'Low',
    status: 'Resolved',
    createdDate: '2026-10-16',
    assignedEngineer: 'Vikram Rao',
    notes: 'Home router password had changed. Reconnected Solis WiFi stick to the new 2.4GHz SSID.',
    warrantyPanelStatus: 'Valid (25-Yr Linear)',
    warrantyInverterStatus: 'Valid (5-Yr)'
  }
];

export const INITIAL_REFERRALS: CustomerReferral[] = [
  {
    id: 'ref-1',
    referrerLeadId: 'sq-205',
    referrerName: 'Anil Bansal',
    referredCustomerName: 'Col. Sanjeev Varma (Neighbour)',
    referredPhone: '+91 98112 44901',
    systemSizeKw: 8,
    status: 'Project Won',
    incentiveAmount: 10000
  },
  {
    id: 'ref-2',
    referrerLeadId: 'sq-201',
    referrerName: 'Dr. Arvind Rao',
    referredCustomerName: 'Dr. P. Sundaram (Colleague)',
    referredPhone: '+91 98451 90812',
    systemSizeKw: 6,
    status: 'In Discussion',
    incentiveAmount: 7500
  }
];

export const INITIAL_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'wa-1',
    name: 'Instant Inbound Sizing & Welcome',
    triggerCategory: 'Lead Welcome',
    content: 'Namaste {{customer_name}}! Thank you for inquiring with SolarQube Energy. Based on your monthly bill of {{monthly_bill}}, our engineering engine recommends an optimal {{system_size_kw}} kWp rooftop solar plant generating ~{{monthly_units}} units/month. Reply YES to schedule a complimentary 3D roof feasibility survey.',
    variables: ['customer_name', 'monthly_bill', 'system_size_kw', 'monthly_units']
  },
  {
    id: 'wa-2',
    name: 'Site Engineer Visit Confirmation',
    triggerCategory: 'Site Visit Reminder',
    content: 'Hi {{customer_name}}, our Solar Engineer {{engineer_name}} (+91 98450 33003) will visit your premises at {{address}} on {{visit_date}} for the 3D shadow profile & DISCOM meter inspection. Please keep your recent power bill handy.',
    variables: ['customer_name', 'engineer_name', 'address', 'visit_date']
  },
  {
    id: 'wa-3',
    name: 'Official Turnkey Proposal & Payback',
    triggerCategory: 'Proposal Link',
    content: 'Dear {{customer_name}}, your customized SolarQube proposal for {{system_size_kw}} kWp is ready! Gross Price: {{gross_cost}} | Govt Subsidy: -{{subsidy_amount}} | Net Investment: {{net_cost}}. Estimated Payback: {{payback_years}} years. View interactive proposal: {{proposal_url}}',
    variables: ['customer_name', 'system_size_kw', 'gross_cost', 'subsidy_amount', 'net_cost', 'payback_years', 'proposal_url']
  },
  {
    id: 'wa-4',
    name: 'DISCOM Net-Meter Approval Alert',
    triggerCategory: 'Subsidy Sanction',
    content: 'Exciting news {{customer_name}}! Your {{discom_name}} Net-Metering technical feasibility has been sanctioned under Application #{{sanction_number}}. Our installation crew will dispatch BOS materials to begin rooftop mounting this week.',
    variables: ['customer_name', 'discom_name', 'sanction_number']
  },
  {
    id: 'wa-5',
    name: 'Referral Cashback Invitation',
    triggerCategory: 'Cleaning Reminder',
    content: 'Hello {{customer_name}}, your {{system_size_kw}} kWp plant generated {{monthly_units}} clean units last month! Happy with your zero electricity bill? Refer a friend or factory owner and earn ₹5,000 to ₹15,000 instant referral bonus on project commissioning.',
    variables: ['customer_name', 'system_size_kw', 'monthly_units']
  }
];

export const INITIAL_ASSIGNMENT_RULES: AutoAssignmentRule[] = [
  {
    id: 'rule-1',
    name: 'Round-Robin Inbound Distribution',
    strategy: 'Round-Robin',
    active: true,
    assignedReps: ['Ananya Sharma', 'Sneha Patel']
  },
  {
    id: 'rule-2',
    name: 'Industrial / C&I Large Projects (>50 kWp)',
    strategy: 'System Size Load',
    active: true,
    assignedReps: ['Sneha Patel', 'Vikram Rao']
  }
];

export const INITIAL_AUDIT_LOGS: AuditTrailLog[] = [
  {
    id: 'log-1',
    actor: 'Ananya Sharma',
    role: 'sales',
    action: 'Created proposal v1.1',
    target: 'Dr. Arvind Rao (sq-201)',
    timestamp: '2026-10-19 14:30'
  },
  {
    id: 'log-2',
    actor: 'Vikram Rao',
    role: 'site_engineer',
    action: 'Completed site survey scan',
    target: 'Zenith Logistics Hub (sq-202)',
    timestamp: '2026-10-18 15:00'
  },
  {
    id: 'log-3',
    actor: 'Sneha Patel',
    role: 'admin',
    action: 'Marked project commissioned & verified DISCOM net meter',
    target: 'Anil & Shalini Bansal (sq-205)',
    timestamp: '2026-10-15 16:00'
  }
];

export const INITIAL_SEQUENCES = [
  {
    id: 'seq-welcome-nurture',
    title: 'Inbound Lead Nurture & Subsidy Primer',
    category: 'Lead Nurture' as const,
    triggerEvent: 'lead_created' as const,
    description: 'Instant welcome email followed by technical sizing guide and state-specific net-metering overview.',
    active: true,
    enrollCount: 42,
    openRatePercent: 78.4,
    clickRatePercent: 44.2,
    steps: [
      {
        stepNumber: 1,
        delayDays: 0,
        delayLabel: 'Instant (within 15 mins)',
        subject: 'Welcome to SolarQube Energy - Sizing Your {{system_size_kw}} kW Solar System',
        bodyTemplate: `Dear {{customer_name}},

Thank you for requesting a solar feasibility assessment with SolarQube Energy!

Based on your current monthly electricity bill of {{monthly_bill}}, our engineering sizing engine recommends an optimal {{system_size_kw}} kWp rooftop solar installation.

Key Sizing Metrics:
- Estimated Generation: ~{{monthly_generation_kwh}} units / month
- Projected Annual Savings: {{annual_savings}}
- Central Govt Subsidy: {{subsidy_amount}} (applicable via PM Surya Ghar)
- Roof Area Required: {{roof_area_sqft}} sq. ft. on {{roof_type}}

One of our solar consultants ({{assigned_to}}) will be in touch to schedule a quick, non-intrusive 3D shadow audit of your roof.

Warm regards,
Sneha Patel | Senior Solar Specialist
SolarQube Energy (sneha@solarqubeenergy.in)`
      }
    ]
  },
  {
    id: 'seq-prop-followup',
    title: 'Proposal Review & 25-Year Levelized Cost Follow-Up',
    category: 'Proposal Close' as const,
    triggerEvent: 'proposal_dispatched' as const,
    description: 'Follows up with commercial and residential leads after quote dispatch with financial payback breakdown.',
    active: true,
    enrollCount: 37,
    openRatePercent: 81.0,
    clickRatePercent: 49.5,
    steps: [
      {
        stepNumber: 1,
        delayDays: 1,
        delayLabel: 'Day 1 after proposal',
        subject: 'SolarQube Detailed Proposal: {{system_size_kw}} kWp Turnkey Solution',
        bodyTemplate: `Dear {{customer_name}},

We have finalized your comprehensive engineering and commercial proposal for the {{system_size_kw}} kWp rooftop solar installation.

Investment Summary:
- Turnkey EPC Package: {{gross_cost}}
- Subsidy / Direct Benefit: -{{subsidy_amount}}
- Net Capital Outlay: {{net_cost}}
- Estimated Payback Period: {{payback_years}} years

Let us know when works for a walkthrough.

Warm regards,
Sneha Patel | SolarQube Energy`
      }
    ]
  }
];

