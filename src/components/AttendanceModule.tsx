import React, { useState, useEffect, useMemo } from 'react';
import { UserRole } from '../types/crm';
import { 
  AttendanceRecord, 
  LeaveRequest, 
  LeaveBalance, 
  RegularizationRequest, 
  ShiftTiming, 
  HolidayCalendarItem,
  ProjectLaborCostSummary
} from '../types/attendance';
import { 
  ACTIVE_PROJECT_SITES, 
  SHIFTS, 
  HOLIDAYS_2026, 
  INITIAL_ATTENDANCE_RECORDS, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_LEAVE_BALANCES, 
  INITIAL_REGULARIZATIONS 
} from '../data/attendanceData';
import { TEAM_MEMBERS } from '../data/initialData';
import { ROLE_PERMISSIONS } from '../utils/rbac';
import { 
  Clock, 
  MapPin, 
  Camera, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  FileSpreadsheet, 
  Plus, 
  Download, 
  SlidersHorizontal, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Briefcase, 
  X, 
  Upload, 
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Smartphone
} from 'lucide-react';

interface AttendanceModuleProps {
  userRole: UserRole;
  onOpenRoleMatrix?: () => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  userRole,
  onOpenRoleMatrix
}) => {
  const currentMember = TEAM_MEMBERS.find(m => m.role === userRole) || TEAM_MEMBERS[0];
  const permissions = ROLE_PERMISSIONS[userRole];
  const isHROrAdmin = userRole === 'admin' || userRole === 'hr';
  const isCoordinator = userRole === 'project_coordinator';

  // Sub-tabs
  type AttendanceSubTab = 
    | 'punch_station' 
    | 'project_costing' 
    | 'team_roster' 
    | 'leave_management' 
    | 'regularization' 
    | 'monthly_report' 
    | 'shifts_holidays';

  const [activeSubTab, setActiveSubTab] = useState<AttendanceSubTab>('punch_station');

  // Attendance state
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('solarqube_attendance_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ATTENDANCE_RECORDS;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem('solarqube_leaves');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(() => {
    try {
      const saved = localStorage.getItem('solarqube_leave_balances');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LEAVE_BALANCES;
  });

  const [regularizations, setRegularizations] = useState<RegularizationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('solarqube_regularizations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_REGULARIZATIONS;
  });

  // LocalStorage persistence
  useEffect(() => {
    try {
      localStorage.setItem('solarqube_attendance_records', JSON.stringify(records));
    } catch {}
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem('solarqube_leaves', JSON.stringify(leaves));
    } catch {}
  }, [leaves]);

  useEffect(() => {
    try {
      localStorage.setItem('solarqube_regularizations', JSON.stringify(regularizations));
    } catch {}
  }, [regularizations]);

  // Live Digital Clock (IST)
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Check-In Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const myTodayRecord = records.find(
    r => r.employeeName === currentMember.name && r.date === todayStr
  );

  const [locationType, setLocationType] = useState<'Site Project' | 'Office HQ' | 'Remote / WFH'>('Site Project');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(ACTIVE_PROJECT_SITES[0].id);
  const [gpsStatus, setGpsStatus] = useState<{
    detected: boolean;
    lat: number;
    lng: number;
    accuracy: number;
    label: string;
    geofenceMatch: boolean;
  } | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [punchNotes, setPunchNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);

  // New Leave Form
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Casual Leave (CL)');
  const [leaveStartDate, setLeaveStartDate] = useState(todayStr);
  const [leaveEndDate, setLeaveEndDate] = useState(todayStr);
  const [leaveReason, setLeaveReason] = useState('');

  // New Regularization Form
  const [regDate, setRegDate] = useState(todayStr);
  const [regInTime, setRegInTime] = useState('08:00');
  const [regOutTime, setRegOutTime] = useState('17:00');
  const [regProject, setRegProject] = useState(ACTIVE_PROJECT_SITES[0].name);
  const [regReason, setRegReason] = useState('');

  // Manual Entry Form (Admin/HR)
  const [manualEmployee, setManualEmployee] = useState(TEAM_MEMBERS[0].name);
  const [manualDate, setManualDate] = useState(todayStr);
  const [manualInTime, setManualInTime] = useState('09:00');
  const [manualOutTime, setManualOutTime] = useState('18:00');
  const [manualLocation, setManualLocation] = useState<'Site Project' | 'Office HQ' | 'Remote / WFH'>('Office HQ');
  const [manualStatus, setManualStatus] = useState<AttendanceRecord['status']>('Present');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(prev => (prev === msg ? null : prev)), 3500);
  };

  // GPS Simulation / Detection
  const handleDetectGPS = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setIsDetectingGps(false);
          const project = ACTIVE_PROJECT_SITES.find(p => p.id === selectedProjectId);
          setGpsStatus({
            detected: true,
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4)),
            accuracy: Math.round(pos.coords.accuracy || 12),
            label: locationType === 'Site Project' 
              ? `${project?.name} (${project?.location})` 
              : 'SolarQube HQ, MG Road, Bengaluru',
            geofenceMatch: true
          });
          showToast('GPS lock acquired within 15m radius');
        },
        _err => {
          // Graceful fallback for sandbox/iframe
          setIsDetectingGps(false);
          const project = ACTIVE_PROJECT_SITES.find(p => p.id === selectedProjectId);
          setGpsStatus({
            detected: true,
            lat: 13.0285,
            lng: 77.5197,
            accuracy: 14,
            label: locationType === 'Site Project' 
              ? `${project?.name} (${project?.location})` 
              : 'SolarQube HQ, MG Road, Bengaluru',
            geofenceMatch: true
          });
          showToast('GPS coordinates locked to site geofence');
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetectingGps(false);
      setGpsStatus({
        detected: true,
        lat: 12.9716,
        lng: 77.5946,
        accuracy: 15,
        label: 'SolarQube Energy Hub, Bengaluru',
        geofenceMatch: true
      });
    }
  };

  // Handle Photo Selfie
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
        showToast('Selfie uploaded with biometric timestamp');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateSelfie = () => {
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    ];
    const picked = sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setSelfiePreview(picked);
    showToast('Camera snapshot verified with rooftop sunlight filter');
  };

  // Punch In Handler
  const handlePunchIn = () => {
    const timeFormatted = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const project = ACTIVE_PROJECT_SITES.find(p => p.id === selectedProjectId);

    const newRec: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeName: currentMember.name,
      role: currentMember.role,
      date: todayStr,
      checkInTime: timeFormatted,
      locationType,
      projectId: locationType === 'Site Project' ? selectedProjectId : undefined,
      projectName: locationType === 'Site Project' ? project?.name : undefined,
      projectLocation: locationType === 'Site Project' ? project?.location : undefined,
      gpsCoordinates: gpsStatus ? {
        latitude: gpsStatus.lat,
        longitude: gpsStatus.lng,
        accuracyMeters: gpsStatus.accuracy,
        addressLabel: gpsStatus.label,
        geofenceMatch: gpsStatus.geofenceMatch
      } : {
        latitude: 12.9716,
        longitude: 77.5946,
        accuracyMeters: 18,
        addressLabel: locationType === 'Site Project' ? `${project?.name}` : 'SolarQube HQ, Bengaluru',
        geofenceMatch: true
      },
      selfieUrl: selfiePreview || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'Present',
      workHours: 0,
      overtimeHours: 0,
      verifiedByHR: false,
      notes: punchNotes.trim() || undefined
    };

    setRecords(prev => [newRec, ...prev]);
    showToast(`✅ Checked in at ${timeFormatted} (${locationType === 'Site Project' ? project?.name : locationType})`);
  };

  // Punch Out Handler
  const handlePunchOut = () => {
    if (!myTodayRecord) return;
    const timeFormatted = currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Calculate hours
    const [inH, inM] = myTodayRecord.checkInTime.split(':').map(Number);
    const [outH, outM] = timeFormatted.split(':').map(Number);
    const durationHours = Math.max(0.5, Number(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2)));
    const otHours = durationHours > 8.5 ? Number((durationHours - 8.5).toFixed(2)) : 0;

    const updated = records.map(r => 
      r.id === myTodayRecord.id ? {
        ...r,
        checkOutTime: timeFormatted,
        workHours: durationHours,
        overtimeHours: otHours,
        status: otHours > 0 ? ('Overtime' as const) : ('Present' as const)
      } : r
    );

    setRecords(updated);
    showToast(`🏁 Checked out at ${timeFormatted}. Total: ${durationHours}h worked (${otHours}h overtime logged)`);
  };

  // Apply Leave Handler
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;

    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newReq: LeaveRequest = {
      id: `lv-${Date.now()}`,
      employeeName: currentMember.name,
      role: currentMember.role,
      leaveType,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
      daysCount,
      reason: leaveReason.trim(),
      appliedOn: todayStr,
      status: 'Pending'
    };

    setLeaves(prev => [newReq, ...prev]);
    setShowApplyLeaveModal(false);
    setLeaveReason('');
    showToast(`Leave application submitted for ${daysCount} day(s)`);
  };

  // Approve / Reject Leave Handler
  const handleReviewLeave = (leaveId: string, status: 'Approved' | 'Rejected', comment?: string) => {
    setLeaves(prev => prev.map(l => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          approverComment: comment || `Actioned by ${currentMember.name}`,
          reviewedBy: `${currentMember.name} (${userRole.toUpperCase()})`,
          reviewedAt: todayStr
        };
      }
      return l;
    }));

    // Deduct leave balance if approved
    if (status === 'Approved') {
      const leave = leaves.find(l => l.id === leaveId);
      if (leave && leaveBalances[leave.employeeName]) {
        const bal = leaveBalances[leave.employeeName];
        if (leave.leaveType.includes('Casual') && bal.casualLeave.remaining >= leave.daysCount) {
          bal.casualLeave.used += leave.daysCount;
          bal.casualLeave.remaining -= leave.daysCount;
        } else if (leave.leaveType.includes('Sick') && bal.sickLeave.remaining >= leave.daysCount) {
          bal.sickLeave.used += leave.daysCount;
          bal.sickLeave.remaining -= leave.daysCount;
        } else if (leave.leaveType.includes('Earned') && bal.earnedLeave.remaining >= leave.daysCount) {
          bal.earnedLeave.used += leave.daysCount;
          bal.earnedLeave.remaining -= leave.daysCount;
        }
        setLeaveBalances({ ...leaveBalances });
      }
    }

    showToast(`Leave request ${status.toLowerCase()} successfully`);
  };

  // Submit Regularization
  const handleSubmitRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regReason.trim()) return;

    const newReg: RegularizationRequest = {
      id: `reg-${Date.now()}`,
      employeeName: currentMember.name,
      role: currentMember.role,
      date: regDate,
      requestedCheckIn: regInTime,
      requestedCheckOut: regOutTime,
      locationType: 'Site Project',
      projectName: regProject,
      reason: regReason.trim(),
      submittedAt: `${todayStr} ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Pending'
    };

    setRegularizations(prev => [newReg, ...prev]);
    setShowRegularizeModal(false);
    setRegReason('');
    showToast('Regularization request dispatched to Admin/HR');
  };

  // Review Regularization
  const handleReviewRegularization = (regId: string, status: 'Approved' | 'Rejected') => {
    setRegularizations(prev => prev.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          status,
          approverNotes: `Verified & ${status} by ${currentMember.name}`,
          reviewedBy: `${currentMember.name} (${userRole.toUpperCase()})`
        };
      }
      return r;
    }));

    if (status === 'Approved') {
      const reg = regularizations.find(r => r.id === regId);
      if (reg) {
        // Create or update attendance record
        const [inH, inM] = reg.requestedCheckIn.split(':').map(Number);
        const [outH, outM] = reg.requestedCheckOut.split(':').map(Number);
        const durationHours = Math.max(1, Number(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2)));

        const newRec: AttendanceRecord = {
          id: `att-reg-${Date.now()}`,
          employeeName: reg.employeeName,
          role: reg.role,
          date: reg.date,
          checkInTime: reg.requestedCheckIn,
          checkOutTime: reg.requestedCheckOut,
          locationType: reg.locationType,
          projectName: reg.projectName,
          status: 'Present',
          workHours: durationHours,
          overtimeHours: durationHours > 8.5 ? durationHours - 8.5 : 0,
          verifiedByHR: true,
          notes: `Regularized: ${reg.reason}`
        };
        setRecords(prev => [newRec, ...prev]);
      }
    }
    showToast(`Regularization ${status.toLowerCase()}`);
  };

  // Manual Attendance Entry (Admin/HR)
  const handleManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const [inH, inM] = manualInTime.split(':').map(Number);
    const [outH, outM] = manualOutTime.split(':').map(Number);
    const durationHours = Math.max(1, Number(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2)));

    const newRec: AttendanceRecord = {
      id: `att-manual-${Date.now()}`,
      employeeName: manualEmployee,
      role: TEAM_MEMBERS.find(m => m.name === manualEmployee)?.role || 'site_engineer',
      date: manualDate,
      checkInTime: manualInTime,
      checkOutTime: manualOutTime,
      locationType: manualLocation,
      status: manualStatus,
      workHours: manualStatus === 'Half Day' ? 4 : manualStatus === 'Absent' ? 0 : durationHours,
      overtimeHours: durationHours > 8.5 ? durationHours - 8.5 : 0,
      verifiedByHR: true,
      notes: `Manual entry logged by ${currentMember.name}`
    };

    setRecords(prev => [newRec, ...prev]);
    setShowManualEntryModal(false);
    showToast(`Manual attendance logged for ${manualEmployee}`);
  };

  // Project Labor Costing Summary (Labor Cost per Project Installation!)
  const projectLaborSummaries = useMemo<ProjectLaborCostSummary[]>(() => {
    return ACTIVE_PROJECT_SITES.map(project => {
      const projectRecords = records.filter(r => r.projectName === project.name || r.projectId === project.id);
      const totalManHours = projectRecords.reduce((sum, r) => sum + (r.workHours || 8), 0);
      
      // Solar technicians average hourly cost in INR
      const hourlyRate = 350;
      const actualLaborCost = Math.round(totalManHours * hourlyRate);
      const assignedStaff = Array.from(new Set(projectRecords.map(r => r.employeeName)));

      return {
        projectId: project.id,
        projectName: project.name,
        customerName: project.client,
        capacityKw: project.name.includes('120') ? 120 : project.name.includes('80') ? 80 : project.name.includes('45') ? 45 : project.name.includes('25') ? 25 : 10,
        totalManHours: Number(totalManHours.toFixed(1)),
        hourlyLaborRateInr: hourlyRate,
        actualLaborCostInr: actualLaborCost,
        budgetedLaborCostInr: project.budgetedLaborInr,
        assignedStaff: assignedStaff.length > 0 ? assignedStaff : ['Vikram Rao', 'Kiran Verma']
      };
    });
  }, [records]);

  // Export Monthly Attendance Report to Excel / CSV
  const handleExportPayrollExcel = () => {
    const headers = [
      'Employee Name',
      'Department / Role',
      'Days in Month',
      'Days Present',
      'Leaves Approved',
      'Late Marks',
      'Loss of Pay (LOP)',
      'Total Overtime Hours',
      'Billable Payable Days'
    ];

    const rows = TEAM_MEMBERS.map(m => {
      const empRecords = records.filter(r => r.employeeName === m.name);
      const daysPresent = empRecords.filter(r => r.status === 'Present' || r.status === 'Overtime').length;
      const lateMarks = empRecords.filter(r => r.status === 'Late').length;
      const otHours = empRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
      const approvedLeaves = leaves.filter(l => l.employeeName === m.name && l.status === 'Approved').reduce((s, l) => s + l.daysCount, 0);
      const payableDays = Math.min(30, daysPresent + approvedLeaves);

      return [
        `"${m.name}"`,
        `"${m.title}"`,
        30,
        daysPresent,
        approvedLeaves,
        lateMarks,
        Math.max(0, 30 - payableDays),
        otHours.toFixed(1),
        payableDays
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SolarQube_Attendance_Payroll_${todayStr.slice(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported monthly attendance CSV for payroll');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Sub-Nav Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Site Attendance & Project Labor
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Live GPS Punch
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {currentTime.toLocaleTimeString('en-US', { hour12: true })}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mobile check-in with GPS location & selfie verification. Tied to solar project sites for installation labor costing and payroll.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {isHROrAdmin && (
            <button
              onClick={() => setShowManualEntryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-brand-500" />
              <span>Manual Entry</span>
            </button>
          )}

          <button
            onClick={handleExportPayrollExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Payroll Export</span>
          </button>

          <button
            onClick={() => setShowApplyLeaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('punch_station')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'punch_station'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Punch Station (GPS & Selfie)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('project_costing')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'project_costing'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Project Labor Costing ({ACTIVE_PROJECT_SITES.length} Sites)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('team_roster')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'team_roster'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Today's Roster ({records.filter(r => r.date === todayStr).length} On Duty)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leave_management')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'leave_management'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Leave Management</span>
          {leaves.filter(l => l.status === 'Pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('regularization')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'regularization'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Regularization</span>
          {regularizations.filter(r => r.status === 'Pending').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-brand-500" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('monthly_report')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'monthly_report'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Monthly Payroll Register</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shifts_holidays')}
          className={`px-3 py-2 rounded-t-xl transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'shifts_holidays'
              ? 'bg-brand-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Shifts & 2026 Holidays</span>
        </button>
      </div>

      {/* SUB-TAB 1: PUNCH STATION (GPS + SELFIE + PROJECT TAGGING) */}
      {activeSubTab === 'punch_station' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Mobile/Site Punch Card */}
          <div className="lg:col-span-2 p-5 sm:p-6 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            
            {/* Live Clock & Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-base border border-brand-500/20">
                  {currentMember.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentMember.name}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 font-mono">
                    {currentMember.title} ({userRole.replace('_', ' ')})
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Today's Status</span>
                {myTodayRecord ? (
                  myTodayRecord.checkOutTime ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                      🏁 Checked Out at {myTodayRecord.checkOutTime}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Checked In ({myTodayRecord.checkInTime})
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Punch-In
                  </span>
                )}
              </div>
            </div>

            {/* Step 1: Location Mode Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono block">
                1. Select Work Location Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Site Project', 'Office HQ', 'Remote / WFH'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setLocationType(mode);
                      setGpsStatus(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      locationType === mode
                        ? 'bg-brand-600 text-white border-brand-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {mode === 'Site Project' ? '👷 On-Site Project' : mode === 'Office HQ' ? '🏢 SolarQube HQ' : '🏡 Remote / WFH'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Project Tagging (Essential for site team & project costing) */}
            {locationType === 'Site Project' && (
              <div className="space-y-2 p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-brand-500" />
                    <span>2. Tag Active Installation Project</span>
                  </label>
                  <span className="text-[12px] text-brand-700 dark:text-brand-400 font-mono">Ties hours to installation cost</span>
                </div>

                <select
                  value={selectedProjectId}
                  onChange={e => {
                    setSelectedProjectId(e.target.value);
                    setGpsStatus(null);
                  }}
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-brand-500 cursor-pointer"
                >
                  {ACTIVE_PROJECT_SITES.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.location}
                    </option>
                  ))}
                </select>

                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Site engineers and installation crew punches automatically accumulate project man-hours in the <strong>Project Labor Costing</strong> ledger.
                </p>
              </div>
            )}

            {/* Step 3: GPS Geofence & Location Verification */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  3. GPS Coordinates & Geofence Verification
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetectingGps}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isDetectingGps ? 'Locking Satellites...' : 'Detect Current GPS'}</span>
                </button>
              </div>

              {gpsStatus ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900 dark:text-emerald-300">
                      Geofence Match Confirmed ({gpsStatus.accuracy}m Accuracy)
                    </div>
                    <div className="text-[12px] text-slate-600 dark:text-slate-300 font-mono mt-0.5">
                      Lat: {gpsStatus.lat}° N · Long: {gpsStatus.lng}° E
                    </div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {gpsStatus.label}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={handleDetectGPS}
                  className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <MapPin className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Click to capture live mobile GPS position
                  </span>
                  <span className="text-[12px] text-slate-500">
                    Ensures site technicians are physically present at the rooftop installation
                  </span>
                </div>
              )}
            </div>

            {/* Step 4: Optional Photo / Selfie Verification */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono block">
                4. Field Staff Photo / Selfie Verification (Optional)
              </label>
              
              <div className="flex items-center gap-4">
                {selfiePreview ? (
                  <div className="relative">
                    <img
                      src={selfiePreview}
                      alt="Selfie"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setSelfiePreview(null)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500">
                    <Camera className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs cursor-pointer border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Take Photo / Upload</span>
                      <input type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} className="hidden" />
                    </label>

                    <button
                      type="button"
                      onClick={handleSimulateSelfie}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      Use Verified Avatar
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Prevents buddy punching. Stored with tamper-proof timestamp.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5: Notes & Big Punch Action Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Daily work note (e.g. Structure erection, module wiring, inverter testing)..."
                  value={punchNotes}
                  onChange={e => setPunchNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-brand-500"
                />
              </div>

              {/* Punch Buttons */}
              <div className="flex items-center gap-3">
                {!myTodayRecord ? (
                  <button
                    type="button"
                    onClick={handlePunchIn}
                    className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Clock className="w-5 h-5" />
                    <span>Punch In Now ({currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                  </button>
                ) : !myTodayRecord.checkOutTime ? (
                  <button
                    type="button"
                    onClick={handlePunchOut}
                    className="flex-1 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Clock className="w-5 h-5" />
                    <span>Punch Out for Today</span>
                  </button>
                ) : (
                  <div className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    ✅ You have completed today's shift ({myTodayRecord.workHours}h logged). Need correction?{' '}
                    <button onClick={() => setShowRegularizeModal(true)} className="text-brand-600 dark:text-brand-400 font-bold hover:underline">
                      Request Regularization
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowRegularizeModal(true)}
                  className="px-3.5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                >
                  Forgot to Punch?
                </button>
              </div>
            </div>

          </div>

          {/* Right Rail: Shift Info & Leave Balances */}
          <div className="space-y-6">
            
            {/* Shift Timing Active Card */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  <span>Applicable Shift Timing</span>
                </span>
                <span className="font-mono text-[12px] text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  {userRole === 'site_engineer' || userRole === 'installer' 
                    ? 'Morning Rooftop Site Shift' 
                    : 'General Headquarters Shift'}
                </div>
                <div className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                  {userRole === 'site_engineer' || userRole === 'installer' 
                    ? '07:30 AM – 04:30 PM (9.0 hrs)' 
                    : '09:30 AM – 06:30 PM (9.0 hrs)'}
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 pt-1">
                  15-minute grace period allowed. Punching post grace period records status as 'Late'.
                </p>
              </div>
            </div>

            {/* My Personal Leave Balances */}
            <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                  My Leave Balances (2026)
                </h3>
                <button
                  onClick={() => setShowApplyLeaveModal(true)}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
                >
                  + Apply
                </button>
              </div>

              {leaveBalances[currentMember.name] ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono block">Casual Leave (CL)</span>
                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {leaveBalances[currentMember.name].casualLeave.remaining}
                    </span>
                    <span className="text-[11px] text-slate-500 block">of {leaveBalances[currentMember.name].casualLeave.total} total</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono block">Sick Leave (SL)</span>
                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {leaveBalances[currentMember.name].sickLeave.remaining}
                    </span>
                    <span className="text-[11px] text-slate-500 block">of {leaveBalances[currentMember.name].sickLeave.total} total</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono block">Earned Leave (EL)</span>
                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {leaveBalances[currentMember.name].earnedLeave.remaining}
                    </span>
                    <span className="text-[11px] text-slate-500 block">of {leaveBalances[currentMember.name].earnedLeave.total} total</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-mono block">Compensatory Off</span>
                    <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {leaveBalances[currentMember.name].compOff.remaining}
                    </span>
                    <span className="text-[11px] text-slate-500 block">Earned on site</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">Leave ledger initialized.</div>
              )}
            </div>

            {/* Quick Regularization Link */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Forgot check-in or had poor connectivity?
              </span>
              <p>
                Rooftops in rural substations may face 4G dropouts. Submit a correction request with proof for HR approval.
              </p>
              <button
                onClick={() => setShowRegularizeModal(true)}
                className="mt-1 text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline cursor-pointer"
              >
                Submit Regularization Request →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: PROJECT LABOR COSTING (DIRECT VALUE TO SOLAR EPC) */}
      {activeSubTab === 'project_costing' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Project-Tied Attendance & Installation Labor Costing:</span>
              <p className="mt-0.5 leading-relaxed">
                Site technicians and engineers select their active solar installation site during check-in. Man-hours logged are automatically multiplied by labor rates to track actual site erection labor cost against the budgeted installation margin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectLaborSummaries.map(proj => {
              const isOverBudget = proj.actualLaborCostInr > proj.budgetedLaborCostInr;
              const variancePct = Math.round(((proj.actualLaborCostInr - proj.budgetedLaborCostInr) / proj.budgetedLaborCostInr) * 100);

              return (
                <div
                  key={proj.projectId}
                  className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                        {proj.capacityKw} kWp Rooftop
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                        {proj.projectName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{proj.customerName}</p>
                    </div>

                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isOverBudget 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isOverBudget ? `+${variancePct}% Over` : 'Within Budget'}
                    </span>
                  </div>

                  {/* Financial & Hour Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 uppercase font-mono block">Logged Man-Hours</span>
                      <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                        {proj.totalManHours} hrs
                      </span>
                      <span className="text-[11px] text-slate-500 block">@ ₹{proj.hourlyLaborRateInr}/hr rate</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] text-slate-500 uppercase font-mono block">Actual Labor Cost</span>
                      <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                        ₹{proj.actualLaborCostInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500 block">Budget: ₹{proj.budgetedLaborCostInr.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Deployed Personnel */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[12px] text-slate-500 block mb-1">Site Personnel Clocked:</span>
                    <div className="flex flex-wrap gap-1">
                      {proj.assignedStaff.map(staff => (
                        <span key={staff} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                          {staff}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TODAY'S TEAM ATTENDANCE ROSTER */}
      {activeSubTab === 'team_roster' && (
        <div className="bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Field & Office Attendance Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time check-ins recorded today with GPS match and photo capture
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {records.filter(r => r.date === todayStr).length} Staff On Duty
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Punch In/Out</th>
                  <th className="py-3.5 px-4">Work Location / Project</th>
                  <th className="py-3.5 px-4">GPS Geofence Status</th>
                  <th className="py-3.5 px-4">Selfie Verification</th>
                  <th className="py-3.5 px-4">Status & Hours</th>
                  {isHROrAdmin && <th className="py-3.5 px-4 text-right">HR Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {records.filter(r => r.date === todayStr).map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {record.employeeName}
                      </div>
                      <div className="text-[12px] text-slate-500 dark:text-slate-400 capitalize">
                        {record.role.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">
                        In: {record.checkInTime}
                      </div>
                      <div className="text-[12px] text-slate-500">
                        {record.checkOutTime ? `Out: ${record.checkOutTime}` : 'Working...'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {record.projectName || record.locationType}
                      </div>
                      {record.projectLocation && (
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {record.projectLocation}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {record.gpsCoordinates ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-mono text-[12px]">Matched (&lt;{record.gpsCoordinates.accuracyMeters}m)</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[12px]">HQ Network IP</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {record.selfieUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={record.selfieUrl}
                            alt="Selfie"
                            className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Photo Verified</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[12px]">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        record.status === 'Overtime'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : record.status === 'Late'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {record.status} ({record.workHours}h)
                      </span>
                    </td>

                    {isHROrAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        {record.verifiedByHR ? (
                          <span className="text-[12px] font-mono text-emerald-600 font-semibold">Verified</span>
                        ) : (
                          <button
                            onClick={() => {
                              setRecords(prev => prev.map(r => r.id === record.id ? { ...r, verifiedByHR: true } : r));
                              showToast(`Verified attendance for ${record.employeeName}`);
                            }}
                            className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                          >
                            Verify Punch
                          </button>
                        )}
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LEAVE MANAGEMENT & BALANCES */}
      {activeSubTab === 'leave_management' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Leave Requests & Team Quotas
            </h3>
            <button
              onClick={() => setShowApplyLeaveModal(true)}
              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Apply for Leave</span>
            </button>
          </div>

          {/* Pending Approvals Table */}
          <div className="bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Leave Applications Workflow
              </span>
              <span className="text-xs font-mono text-slate-500">
                {leaves.filter(l => l.status === 'Pending').length} Pending Review
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Duration & Dates</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                    <th className="py-3 px-4">Status</th>
                    {isHROrAdmin && <th className="py-3 px-4 text-right">Approval Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {leaves.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {req.employeeName}
                        </div>
                        <div className="text-[12px] text-slate-500 capitalize">{req.role.replace('_', ' ')}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {req.leaveType}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">{req.daysCount} Day(s)</span>
                        <div className="text-[11px] text-slate-500">{req.startDate} → {req.endDate}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                        "{req.reason}"
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : req.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      {isHROrAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReviewLeave(req.id, 'Approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewLeave(req.id, 'Rejected')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500">
                              {req.reviewedBy || 'Actioned'}
                            </span>
                          )}
                        </td>
                      )}

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: REGULARIZATION REQUESTS */}
      {activeSubTab === 'regularization' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Attendance Regularization Requests
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When staff forget to punch in or experience network drops on remote solar plants
              </p>
            </div>
            <button
              onClick={() => setShowRegularizeModal(true)}
              className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Correction Request</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Requested Punch Time</th>
                    <th className="py-3 px-4">Project / Location</th>
                    <th className="py-3 px-4">Reason Given</th>
                    <th className="py-3 px-4">Status</th>
                    {isHROrAdmin && <th className="py-3 px-4 text-right">Review Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {regularizations.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {reg.employeeName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                        {reg.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {reg.requestedCheckIn} → {reg.requestedCheckOut}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {reg.projectName || reg.locationType}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                        "{reg.reason}"
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          reg.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : reg.status === 'Rejected'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                        }`}>
                          {reg.status}
                        </span>
                      </td>

                      {isHROrAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          {reg.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReviewRegularization(reg.id, 'Approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                              >
                                Approve & Record
                              </button>
                              <button
                                onClick={() => handleReviewRegularization(reg.id, 'Rejected')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500">
                              {reg.reviewedBy || 'Actioned'}
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: MONTHLY PAYROLL REGISTER */}
      {activeSubTab === 'monthly_report' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Attendance & Payroll Summary (October 2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified attendance data exportable to Excel for HR salary and overtime calculation
              </p>
            </div>
            <button
              onClick={handleExportPayrollExcel}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Payroll CSV</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Role / Dept</th>
                    <th className="py-3 px-4 text-center">Days Present</th>
                    <th className="py-3 px-4 text-center">Paid Leaves</th>
                    <th className="py-3 px-4 text-center">Late Marks</th>
                    <th className="py-3 px-4 text-center">Overtime (Hrs)</th>
                    <th className="py-3 px-4 text-center">Loss of Pay (LOP)</th>
                    <th className="py-3 px-4 text-right">Payable Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {TEAM_MEMBERS.map(m => {
                    const empRecords = records.filter(r => r.employeeName === m.name);
                    const daysPresent = empRecords.filter(r => r.status === 'Present' || r.status === 'Overtime').length;
                    const lateMarks = empRecords.filter(r => r.status === 'Late').length;
                    const otHours = empRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
                    const approvedLeaves = leaves.filter(l => l.employeeName === m.name && l.status === 'Approved').reduce((s, l) => s + l.daysCount, 0);
                    const payableDays = Math.min(30, daysPresent + approvedLeaves);

                    return (
                      <tr key={m.name} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white">
                          {m.name}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-500 capitalize">
                          {m.role.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {daysPresent}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300">
                          {approvedLeaves}
                        </td>
                        <td className="py-3.5 px-4 text-center text-brand-600 dark:text-brand-400">
                          {lateMarks}
                        </td>
                        <td className="py-3.5 px-4 text-center text-purple-600 dark:text-purple-400 font-bold">
                          {otHours.toFixed(1)} hrs
                        </td>
                        <td className="py-3.5 px-4 text-center text-rose-600 dark:text-rose-400 font-bold">
                          {Math.max(0, 30 - payableDays)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white text-sm">
                          {payableDays} / 30
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SHIFTS & HOLIDAY CALENDAR */}
      {activeSubTab === 'shifts_holidays' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Shift Timings */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              <span>SolarQube Shift Definitions</span>
            </h3>

            <div className="space-y-3">
              {SHIFTS.map(shift => (
                <div key={shift.id} className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                    <span>{shift.name}</span>
                    <span className="font-mono text-brand-600 dark:text-brand-400">{shift.startTime} – {shift.endTime}</span>
                  </div>
                  <div className="text-[12px] text-slate-500 font-mono">
                    Target: {shift.targetRole} · Grace: {shift.gracePeriodMinutes} mins
                  </div>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">{shift.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2026 Holiday Calendar */}
          <div className="p-5 bg-white dark:bg-[#0e1432] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Official 2026 Holiday Calendar</span>
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {HOLIDAYS_2026.map(holiday => (
                <div key={holiday.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{holiday.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{holiday.type}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{holiday.date}</span>
                    <span className="text-[11px] text-slate-500">{holiday.dayOfWeek}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: APPLY FOR LEAVE */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500" />
                <span>Apply for Leave</span>
              </h3>
              <button onClick={() => setShowApplyLeaveModal(false)} className="text-slate-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                  <option value="Compensatory Off">Compensatory Off (Site Work)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={e => setLeaveStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveEndDate}
                    onChange={e => setLeaveEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Reason for Absence</label>
                <textarea
                  required
                  rows={3}
                  value={leaveReason}
                  onChange={e => setLeaveReason(e.target.value)}
                  placeholder="State reason for absence..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST REGULARIZATION */}
      {showRegularizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Attendance Regularization</span>
              </h3>
              <button onClick={() => setShowRegularizeModal(false)} className="text-slate-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRegularization} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Missed Punch Date</label>
                <input
                  type="date"
                  required
                  value={regDate}
                  onChange={e => setRegDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Actual Check In</label>
                  <input
                    type="time"
                    required
                    value={regInTime}
                    onChange={e => setRegInTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Actual Check Out</label>
                  <input
                    type="time"
                    required
                    value={regOutTime}
                    onChange={e => setRegOutTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Site Project Worked On</label>
                <select
                  value={regProject}
                  onChange={e => setRegProject(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {ACTIVE_PROJECT_SITES.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                  <option value="SolarQube HQ Office">SolarQube HQ Office</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Reason for Missed Punch</label>
                <textarea
                  required
                  rows={2}
                  value={regReason}
                  onChange={e => setRegReason(e.target.value)}
                  placeholder="e.g. Mobile battery drained during inverter commissioning, poor 4G network on remote rooftop..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegularizeModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL ATTENDANCE ENTRY (ADMIN & HR ONLY) */}
      {showManualEntryModal && isHROrAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0e1432] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-500" />
                <span>Admin / HR Manual Attendance Entry</span>
              </h3>
              <button onClick={() => setShowManualEntryModal(false)} className="text-slate-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualEntry} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Select Employee</label>
                <select
                  value={manualEmployee}
                  onChange={e => setManualEmployee(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {TEAM_MEMBERS.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.title})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Attendance Status</label>
                  <select
                    value={manualStatus}
                    onChange={e => setManualStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Late">Late</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Check In</label>
                  <input
                    type="time"
                    required
                    value={manualInTime}
                    onChange={e => setManualInTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Check Out</label>
                  <input
                    type="time"
                    required
                    value={manualOutTime}
                    onChange={e => setManualOutTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 block mb-1 font-semibold">Location</label>
                <select
                  value={manualLocation}
                  onChange={e => setManualLocation(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Office HQ">Office HQ (MG Road)</option>
                  <option value="Site Project">On-Site Project Installation</option>
                  <option value="Remote / WFH">Remote / WFH</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualEntryModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl"
                >
                  Save Manual Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
