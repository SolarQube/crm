export interface AttendanceRecord {
  id: string;
  employeeName: string;
  role: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM
  checkOutTime?: string;
  locationType: 'Site Project' | 'Office HQ' | 'Remote / WFH';
  projectId?: string;
  projectName?: string;
  projectLocation?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracyMeters: number;
    addressLabel: string;
    geofenceMatch: boolean;
  };
  selfieUrl?: string;
  status: 'Present' | 'Late' | 'Half Day' | 'Overtime' | 'Absent';
  workHours: number;
  overtimeHours: number;
  verifiedByHR: boolean;
  notes?: string;
}

export type LeaveType = 
  | 'Casual Leave (CL)' 
  | 'Sick Leave (SL)' 
  | 'Earned Leave (EL)' 
  | 'Compensatory Off';

export interface LeaveRequest {
  id: string;
  employeeName: string;
  role: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  appliedOn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface LeaveBalance {
  employeeName: string;
  casualLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  earnedLeave: { total: number; used: number; remaining: number };
  compOff: { total: number; used: number; remaining: number };
}

export interface RegularizationRequest {
  id: string;
  employeeName: string;
  role: string;
  date: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  locationType: 'Site Project' | 'Office HQ' | 'Remote / WFH';
  projectId?: string;
  projectName?: string;
  reason: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approverNotes?: string;
  reviewedBy?: string;
}

export interface ShiftTiming {
  id: string;
  name: string;
  targetRole: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  description: string;
}

export interface HolidayCalendarItem {
  id: string;
  date: string;
  name: string;
  type: 'National Gazetted' | 'State / Regional' | 'Solar Industry Milestone';
  dayOfWeek: string;
}

export interface ProjectLaborCostSummary {
  projectId: string;
  projectName: string;
  customerName: string;
  capacityKw: number;
  totalManHours: number;
  hourlyLaborRateInr: number;
  actualLaborCostInr: number;
  budgetedLaborCostInr: number;
  assignedStaff: string[];
}
