import { 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  RegularizationRequest, 
  ShiftTiming, 
  HolidayCalendarItem 
} from '../types/attendance';

export const ACTIVE_PROJECT_SITES = [
  { id: 'proj-apex', name: 'Apex Logistics Rooftop (120 kWp)', location: 'Peenya Industrial Area, Bengaluru', client: 'Apex Logistics Hub', budgetedLaborInr: 180000 },
  { id: 'proj-kaveri', name: 'Kaveri Silk Mills (80 kWp)', location: 'Doddaballapura Industrial Cluster', client: 'Kaveri Textiles Ltd', budgetedLaborInr: 120000 },
  { id: 'proj-rao', name: 'Dr. Arvind Rao Villa (10 kWp)', location: 'Plot 42, Green Meadows, Whitefield', client: 'Dr. Arvind Rao', budgetedLaborInr: 35000 },
  { id: 'proj-bansal', name: 'Bansal Cold Storage (45 kWp)', location: 'Hosur Road Logistics Corridor', client: 'Bansal Agro Cold Storage', budgetedLaborInr: 75000 },
  { id: 'proj-sobha', name: 'Sobha Suncrest Society (25 kWp)', location: 'Sarjapur Road, Bengaluru', client: 'Sobha Suncrest HOA', budgetedLaborInr: 45000 }
];

export const SHIFTS: ShiftTiming[] = [
  {
    id: 'shift-site-early',
    name: 'Morning Rooftop Site Shift',
    targetRole: 'Site Engineer & Installers',
    startTime: '07:30',
    endTime: '16:30',
    gracePeriodMinutes: 15,
    description: 'Scheduled early to avoid extreme midday solar rooftop heat and ensure safety.'
  },
  {
    id: 'shift-general',
    name: 'General Headquarters Shift',
    targetRole: 'Admin, HR, Sales & Coordinators',
    startTime: '09:30',
    endTime: '18:30',
    gracePeriodMinutes: 15,
    description: 'Standard office hours for design proposals, customer coordination, and accounts.'
  },
  {
    id: 'shift-commissioning',
    name: 'Commissioning & Testing Overtime',
    targetRole: 'Field Engineering Liaison',
    startTime: '10:00',
    endTime: '19:30',
    gracePeriodMinutes: 20,
    description: 'Synchronized with DISCOM inspection engineers for net-meter cutovers and testing.'
  }
];

export const HOLIDAYS_2026: HolidayCalendarItem[] = [
  { id: 'h-1', date: '2026-01-26', name: 'Republic Day', type: 'National Gazetted', dayOfWeek: 'Monday' },
  { id: 'h-2', date: '2026-03-04', name: 'Holi Festival of Colors', type: 'State / Regional', dayOfWeek: 'Wednesday' },
  { id: 'h-3', date: '2026-05-01', name: 'International Workers Day', type: 'National Gazetted', dayOfWeek: 'Friday' },
  { id: 'h-4', date: '2026-06-21', name: 'Summer Solstice (Peak Solar Output Day)', type: 'Solar Industry Milestone', dayOfWeek: 'Sunday' },
  { id: 'h-5', date: '2026-08-15', name: 'Independence Day', type: 'National Gazetted', dayOfWeek: 'Saturday' },
  { id: 'h-6', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National Gazetted', dayOfWeek: 'Friday' },
  { id: 'h-7', date: '2026-11-01', name: 'Karnataka Rajyotsava', type: 'State / Regional', dayOfWeek: 'Sunday' },
  { id: 'h-8', date: '2026-11-08', name: 'Deepavali Festival of Lights', type: 'National Gazetted', dayOfWeek: 'Sunday' }
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'att-101',
    employeeName: 'Vikram Rao',
    role: 'site_engineer',
    date: '2026-10-20',
    checkInTime: '07:42',
    checkOutTime: '16:45',
    locationType: 'Site Project',
    projectId: 'proj-apex',
    projectName: 'Apex Logistics Rooftop (120 kWp)',
    projectLocation: 'Peenya Industrial Area, Bengaluru',
    gpsCoordinates: {
      latitude: 13.0285,
      longitude: 77.5197,
      accuracyMeters: 12,
      addressLabel: 'Peenya 2nd Stage, Bengaluru, Karnataka 560058',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 9.05,
    overtimeHours: 0.5,
    verifiedByHR: true,
    notes: 'Completed azimuth alignment and shadow drone scan.'
  },
  {
    id: 'att-102',
    employeeName: 'Kiran Verma',
    role: 'installer',
    date: '2026-10-20',
    checkInTime: '07:28',
    locationType: 'Site Project',
    projectId: 'proj-apex',
    projectName: 'Apex Logistics Rooftop (120 kWp)',
    projectLocation: 'Peenya Industrial Area, Bengaluru',
    gpsCoordinates: {
      latitude: 13.0287,
      longitude: 77.5195,
      accuracyMeters: 9,
      addressLabel: 'Apex Logistics Shed 4, Peenya, Bengaluru',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 8.5,
    overtimeHours: 1.0,
    verifiedByHR: true,
    notes: 'Bolted 48 HDGI mounting rails with torque wrench.'
  },
  {
    id: 'att-103',
    employeeName: 'Ananya Sharma',
    role: 'sales',
    date: '2026-10-20',
    checkInTime: '09:25',
    locationType: 'Office HQ',
    gpsCoordinates: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracyMeters: 15,
      addressLabel: 'SolarQube Energy HQ, MG Road, Bengaluru',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 8.0,
    overtimeHours: 0,
    verifiedByHR: true,
    notes: 'Client meetings and proposal dispatches.'
  },
  {
    id: 'att-104',
    employeeName: 'Rajesh Menon',
    role: 'project_coordinator',
    date: '2026-10-20',
    checkInTime: '09:15',
    locationType: 'Office HQ',
    gpsCoordinates: {
      latitude: 12.9718,
      longitude: 77.5948,
      accuracyMeters: 18,
      addressLabel: 'SolarQube Energy HQ, MG Road, Bengaluru',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 8.2,
    overtimeHours: 0,
    verifiedByHR: true,
    notes: 'Coordinated BOS delivery to Doddaballapura site.'
  },
  {
    id: 'att-105',
    employeeName: 'Pooja Nair',
    role: 'hr',
    date: '2026-10-20',
    checkInTime: '09:20',
    locationType: 'Office HQ',
    gpsCoordinates: {
      latitude: 12.9716,
      longitude: 77.5946,
      accuracyMeters: 10,
      addressLabel: 'SolarQube Energy HQ, MG Road, Bengaluru',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 8.0,
    overtimeHours: 0,
    verifiedByHR: true,
    notes: 'Payroll biometric verification and onboarding.'
  },
  {
    id: 'att-106',
    employeeName: 'Vikram Rao',
    role: 'site_engineer',
    date: '2026-10-19',
    checkInTime: '07:35',
    checkOutTime: '16:40',
    locationType: 'Site Project',
    projectId: 'proj-kaveri',
    projectName: 'Kaveri Silk Mills (80 kWp)',
    projectLocation: 'Doddaballapura Industrial Cluster',
    gpsCoordinates: {
      latitude: 13.2985,
      longitude: 77.5412,
      accuracyMeters: 14,
      addressLabel: 'Plot 18, Doddaballapura Textile Park, Karnataka',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Present',
    workHours: 9.08,
    overtimeHours: 0.5,
    verifiedByHR: true,
    notes: 'Feasibility survey for 80kWp tin shed installation.'
  },
  {
    id: 'att-107',
    employeeName: 'Kiran Verma',
    role: 'installer',
    date: '2026-10-19',
    checkInTime: '07:30',
    checkOutTime: '17:15',
    locationType: 'Site Project',
    projectId: 'proj-kaveri',
    projectName: 'Kaveri Silk Mills (80 kWp)',
    projectLocation: 'Doddaballapura Industrial Cluster',
    gpsCoordinates: {
      latitude: 13.2985,
      longitude: 77.5412,
      accuracyMeters: 11,
      addressLabel: 'Plot 18, Doddaballapura Textile Park, Karnataka',
      geofenceMatch: true
    },
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Overtime',
    workHours: 9.75,
    overtimeHours: 1.5,
    verifiedByHR: true,
    notes: 'Unloaded panels and staged BOS cables in rainproof shed.'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lv-01',
    employeeName: 'Kiran Verma',
    role: 'installer',
    leaveType: 'Casual Leave (CL)',
    startDate: '2026-10-24',
    endDate: '2026-10-25',
    daysCount: 2,
    reason: 'Family wedding ceremony in Mysuru.',
    appliedOn: '2026-10-18',
    status: 'Pending'
  },
  {
    id: 'lv-02',
    employeeName: 'Ananya Sharma',
    role: 'sales',
    leaveType: 'Earned Leave (EL)',
    startDate: '2026-11-04',
    endDate: '2026-11-07',
    daysCount: 4,
    reason: 'Annual Diwali festival personal vacation.',
    appliedOn: '2026-10-15',
    status: 'Approved',
    approverComment: 'Approved. Advance pipeline proposals dispatched.',
    reviewedBy: 'Sneha Patel (Admin)',
    reviewedAt: '2026-10-16'
  },
  {
    id: 'lv-03',
    employeeName: 'Vikram Rao',
    role: 'site_engineer',
    leaveType: 'Sick Leave (SL)',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    daysCount: 1,
    reason: 'Viral fever and medical consultation.',
    appliedOn: '2026-10-12',
    status: 'Approved',
    approverComment: 'Approved with medical slip attached.',
    reviewedBy: 'Pooja Nair (HR)',
    reviewedAt: '2026-10-13'
  }
];

export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  'Sneha Patel': {
    employeeName: 'Sneha Patel',
    casualLeave: { total: 12, used: 2, remaining: 10 },
    sickLeave: { total: 8, used: 0, remaining: 8 },
    earnedLeave: { total: 15, used: 3, remaining: 12 },
    compOff: { total: 4, used: 1, remaining: 3 }
  },
  'Pooja Nair': {
    employeeName: 'Pooja Nair',
    casualLeave: { total: 12, used: 3, remaining: 9 },
    sickLeave: { total: 8, used: 1, remaining: 7 },
    earnedLeave: { total: 15, used: 2, remaining: 13 },
    compOff: { total: 2, used: 0, remaining: 2 }
  },
  'Ananya Sharma': {
    employeeName: 'Ananya Sharma',
    casualLeave: { total: 12, used: 4, remaining: 8 },
    sickLeave: { total: 8, used: 2, remaining: 6 },
    earnedLeave: { total: 15, used: 4, remaining: 11 },
    compOff: { total: 3, used: 1, remaining: 2 }
  },
  'Rajesh Menon': {
    employeeName: 'Rajesh Menon',
    casualLeave: { total: 12, used: 2, remaining: 10 },
    sickLeave: { total: 8, used: 1, remaining: 7 },
    earnedLeave: { total: 15, used: 3, remaining: 12 },
    compOff: { total: 5, used: 2, remaining: 3 }
  },
  'Vikram Rao': {
    employeeName: 'Vikram Rao',
    casualLeave: { total: 12, used: 3, remaining: 9 },
    sickLeave: { total: 8, used: 2, remaining: 6 },
    earnedLeave: { total: 15, used: 1, remaining: 14 },
    compOff: { total: 6, used: 3, remaining: 3 }
  },
  'Kiran Verma': {
    employeeName: 'Kiran Verma',
    casualLeave: { total: 12, used: 4, remaining: 8 },
    sickLeave: { total: 8, used: 1, remaining: 7 },
    earnedLeave: { total: 15, used: 0, remaining: 15 },
    compOff: { total: 8, used: 4, remaining: 4 }
  }
};

export const INITIAL_REGULARIZATIONS: RegularizationRequest[] = [
  {
    id: 'reg-01',
    employeeName: 'Vikram Rao',
    role: 'site_engineer',
    date: '2026-10-16',
    requestedCheckIn: '07:30',
    requestedCheckOut: '16:30',
    locationType: 'Site Project',
    projectId: 'proj-bansal',
    projectName: 'Bansal Cold Storage (45 kWp)',
    reason: 'Low 4G mobile connectivity on rural industrial rooftop prevented GPS punch.',
    submittedAt: '2026-10-17 08:30',
    status: 'Pending'
  },
  {
    id: 'reg-02',
    employeeName: 'Kiran Verma',
    role: 'installer',
    date: '2026-10-14',
    requestedCheckIn: '07:45',
    requestedCheckOut: '17:00',
    locationType: 'Site Project',
    projectId: 'proj-apex',
    projectName: 'Apex Logistics Rooftop (120 kWp)',
    reason: 'Phone battery drained while taking module mounting torque checklist photos.',
    submittedAt: '2026-10-15 08:10',
    status: 'Approved',
    approverNotes: 'Verified against Apex Logistics security gate register.',
    reviewedBy: 'Pooja Nair (HR)'
  }
];
