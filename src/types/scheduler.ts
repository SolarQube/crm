export type TeamId = 'Team A' | 'Team B';

export interface ResourceMember {
  id: string;
  name: string;
  role: string;
  team: TeamId;
  phone: string;
  email: string;
  specialization: string;
  isLead: boolean;
  activeStatus: 'Available' | 'On Site' | 'On Leave';
}

export interface InstallationPhaseDefinition {
  id: number;
  name: string;
  shortName: string;
  description: string;
  standardDurationDays: number;
  keySafetyRequirement: string;
}

export interface PhaseSchedule {
  id: string;
  projectId: string;
  projectName: string;
  systemSizeKw: number;
  city: string;
  phaseId: number;
  phaseName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  assignedTeam: TeamId | 'Mixed';
  assignedMemberIds: string[];
  assignedMemberNames: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  notes?: string;
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface ScheduleConflict {
  id: string;
  conflictType: 'member_double_booked' | 'team_double_booked';
  memberName?: string;
  memberId?: string;
  team?: TeamId;
  existingProject: string;
  existingPhase: string;
  existingDates: string;
  conflictingProject: string;
  conflictingPhase: string;
  conflictingDates: string;
  overlapDays: string;
  message: string;
}
