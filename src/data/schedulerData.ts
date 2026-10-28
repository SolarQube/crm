import { ResourceMember, InstallationPhaseDefinition, PhaseSchedule, ScheduleConflict, TeamId } from '../types/scheduler';

export const FIELD_TEAM_MEMBERS: ResourceMember[] = [
  // --- TEAM A ---
  {
    id: 'm-kiran',
    name: 'Kiran Verma',
    role: 'Lead Installation Supervisor',
    team: 'Team A',
    phone: '+91 98450 44004',
    email: 'kiran.verma@solarqubeenergy.in',
    specialization: 'Overall erection, module clamping, inverter wiring & CEIG safety',
    isLead: true,
    activeStatus: 'On Site'
  },
  {
    id: 'm-vikram',
    name: 'Vikram Rao',
    role: 'Lead Site & Commissioning Engineer',
    team: 'Team A',
    phone: '+91 98450 33003',
    email: 'vikram.rao@solarqubeenergy.in',
    specialization: 'Megger testing, VOC/ISC verification & DISCOM liaison',
    isLead: false,
    activeStatus: 'On Site'
  },
  {
    id: 'm-amit',
    name: 'Amit Kumar',
    role: 'Senior Solar Electrician',
    team: 'Team A',
    phone: '+91 98450 44011',
    email: 'amit.kumar@solarqubeenergy.in',
    specialization: 'DC stringing, combiner boxes, and inverter DC cable crimping',
    isLead: false,
    activeStatus: 'Available'
  },
  {
    id: 'm-sunil',
    name: 'Sunil Yadav',
    role: 'Fabrication & Structural Rigging Specialist',
    team: 'Team A',
    phone: '+91 98450 44012',
    email: 'sunil.yadav@solarqubeenergy.in',
    specialization: 'HDGI structure anchoring, chemical grouting & torque audits',
    isLead: false,
    activeStatus: 'Available'
  },

  // --- TEAM B ---
  {
    id: 'm-suresh',
    name: 'Suresh Patil',
    role: 'Lead Electrical Supervisor',
    team: 'Team B',
    phone: '+91 98450 88001',
    email: 'suresh.patil@solarqubeenergy.in',
    specialization: 'LT/HT electrical panels, ACDB installation & synchronization',
    isLead: true,
    activeStatus: 'On Site'
  },
  {
    id: 'm-arjun',
    name: 'Arjun Mehta',
    role: 'Commissioning & Testing Engineer',
    team: 'Team B',
    phone: '+91 98450 88002',
    email: 'arjun.mehta@solarqubeenergy.in',
    specialization: 'Earth pit resistance (<1 ohm), relay calibration & net-meter checks',
    isLead: false,
    activeStatus: 'Available'
  },
  {
    id: 'm-deepak',
    name: 'Deepak Joshi',
    role: 'Rooftop Rail & Module Technician',
    team: 'Team B',
    phone: '+91 98450 88003',
    email: 'deepak.joshi@solarqubeenergy.in',
    specialization: 'Aluminium mini-rail mounting, mid/end clamp torqueing',
    isLead: false,
    activeStatus: 'On Site'
  },
  {
    id: 'm-rakesh',
    name: 'Rakesh Shinde',
    role: 'Cabling & Earthing Wireman',
    team: 'Team B',
    phone: '+91 98450 88004',
    email: 'rakesh.shinde@solarqubeenergy.in',
    specialization: 'Chemical earthing pits, copper strip routing & cable trays',
    isLead: false,
    activeStatus: 'Available'
  }
];

export const INSTALLATION_PHASES: InstallationPhaseDefinition[] = [
  {
    id: 1,
    name: 'Phase 1: Material Inward & Site Preparation',
    shortName: '1. Material & Prep',
    description: 'BOS modules, inverter, rail delivery, storage staging & roof perimeter safety lifelines.',
    standardDurationDays: 2,
    keySafetyRequirement: 'Hard hats, safety harness on edge, and inventory checklist audit.'
  },
  {
    id: 2,
    name: 'Phase 2: Structure & Rail Anchoring',
    shortName: '2. Structure Erection',
    description: 'HDGI column base-plate chemical grouting, purlin clamps, and rail slope alignment.',
    standardDurationDays: 3,
    keySafetyRequirement: 'Torque wrench calibration (35 Nm) and water leakage waterproofing check.'
  },
  {
    id: 3,
    name: 'Phase 3: Module Clamping & Stringing',
    shortName: '3. Panel Clamping',
    description: 'Mono PERC/TOPCon module laying, mid/end clamping, and MC4 string connection.',
    standardDurationDays: 3,
    keySafetyRequirement: 'Dual-clamp grip, no panel walking, insulated tools.'
  },
  {
    id: 4,
    name: 'Phase 4: Inverter & DC Combiner Setup',
    shortName: '4. Inverter & DC Wiring',
    description: 'String inverter wall/strut mounting, DC cabling through UV conduits, SPD & fuses.',
    standardDurationDays: 2,
    keySafetyRequirement: 'DC open-circuit voltage polarity test before inverter connection.'
  },
  {
    id: 5,
    name: 'Phase 5: AC Distribution & Earthing Pits',
    shortName: '5. AC & Earthing',
    description: 'ACDB installation, bidirectional meter wiring, and dedicated chemical earthing pits.',
    standardDurationDays: 2,
    keySafetyRequirement: 'Earth pit resistance verification below 1.0 Ohm.'
  },
  {
    id: 6,
    name: 'Phase 6: Megger & Pre-Commissioning Tests',
    shortName: '6. Megger & Testing',
    description: 'Insulation resistance (Megger), VOC/ISC matching, inverter idle run & firmware sync.',
    standardDurationDays: 1,
    keySafetyRequirement: 'Safety lockout/tagout (LOTO) protocols.'
  },
  {
    id: 7,
    name: 'Phase 7: DISCOM Net-Meter & Grid Sync',
    shortName: '7. Net-Meter & Sync',
    description: 'Joint inspection with DISCOM engineer, bi-directional net meter install, plant energization.',
    standardDurationDays: 1,
    keySafetyRequirement: 'DISCOM lineman coordination & CEIG sign-off certificate.'
  }
];

export const SCHEDULED_PROJECTS = [
  { id: 'proj-apex', name: 'Apex Spintex Pvt Ltd', capacityKw: 75, city: 'Bhiwandi, MH' },
  { id: 'proj-zenith', name: 'Zenith Logistics Hub', capacityKw: 120, city: 'Bhiwandi, MH' },
  { id: 'proj-arvind', name: 'Dr. Arvind Rao Villa', capacityKw: 10, city: 'Bengaluru, KA' },
  { id: 'proj-patil', name: 'Patil Agro Cold Storage', capacityKw: 25, city: 'Baramati, MH' },
  { id: 'proj-sharma', name: 'Sharma Residency', capacityKw: 8, city: 'Bengaluru, KA' }
];

export const INITIAL_PHASE_SCHEDULES: PhaseSchedule[] = [
  // --- Apex Spintex (Team A assigned) ---
  {
    id: 'sch-101',
    projectId: 'proj-apex',
    projectName: 'Apex Spintex Pvt Ltd',
    systemSizeKw: 75,
    city: 'Bhiwandi, MH',
    phaseId: 2,
    phaseName: 'Phase 2: Structure & Rail Anchoring',
    startDate: '2026-10-22',
    endDate: '2026-10-25',
    assignedTeam: 'Team A',
    assignedMemberIds: ['m-kiran', 'm-sunil'],
    assignedMemberNames: ['Kiran Verma', 'Sunil Yadav'],
    status: 'In Progress',
    notes: 'Elevated 7ft HDGI columns on RCC terrace. Chemical anchor curing completed on North bay.'
  },
  {
    id: 'sch-102',
    projectId: 'proj-apex',
    projectName: 'Apex Spintex Pvt Ltd',
    systemSizeKw: 75,
    city: 'Bhiwandi, MH',
    phaseId: 3,
    phaseName: 'Phase 3: Module Clamping & Stringing',
    startDate: '2026-10-26',
    endDate: '2026-10-29',
    assignedTeam: 'Team A',
    assignedMemberIds: ['m-kiran', 'm-amit'],
    assignedMemberNames: ['Kiran Verma', 'Amit Kumar'],
    status: 'Scheduled',
    notes: '136x Waaree 550Wp TOPCon modules to be clamped in 8 series strings.'
  },
  {
    id: 'sch-103',
    projectId: 'proj-apex',
    projectName: 'Apex Spintex Pvt Ltd',
    systemSizeKw: 75,
    city: 'Bhiwandi, MH',
    phaseId: 6,
    phaseName: 'Phase 6: Megger & Pre-Commissioning Tests',
    startDate: '2026-10-30',
    endDate: '2026-10-31',
    assignedTeam: 'Team A',
    assignedMemberIds: ['m-vikram', 'm-kiran'],
    assignedMemberNames: ['Vikram Rao', 'Kiran Verma'],
    status: 'Scheduled',
    notes: 'Insulation resistance Megger test and CEIG checklist validation.'
  },

  // --- Dr. Arvind Rao Villa (Team B assigned) ---
  {
    id: 'sch-104',
    projectId: 'proj-arvind',
    projectName: 'Dr. Arvind Rao Villa',
    systemSizeKw: 10,
    city: 'Bengaluru, KA',
    phaseId: 3,
    phaseName: 'Phase 3: Module Clamping & Stringing',
    startDate: '2026-10-22',
    endDate: '2026-10-24',
    assignedTeam: 'Team B',
    assignedMemberIds: ['m-suresh', 'm-deepak'],
    assignedMemberNames: ['Suresh Patil', 'Deepak Joshi'],
    status: 'In Progress',
    notes: '18x Bifacial modules on elevated terrace frame. Customer requested zero drilling through slab.'
  },
  {
    id: 'sch-105',
    projectId: 'proj-arvind',
    projectName: 'Dr. Arvind Rao Villa',
    systemSizeKw: 10,
    city: 'Bengaluru, KA',
    phaseId: 5,
    phaseName: 'Phase 5: AC Distribution & Earthing Pits',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    assignedTeam: 'Team B',
    assignedMemberIds: ['m-suresh', 'm-rakesh'],
    assignedMemberNames: ['Suresh Patil', 'Rakesh Shinde'],
    status: 'Scheduled',
    notes: 'Dual chemical earthing pits for AC and DC surge protection.'
  },

  // --- Zenith Logistics (Mixed / Scheduled) ---
  {
    id: 'sch-106',
    projectId: 'proj-zenith',
    projectName: 'Zenith Logistics Hub',
    systemSizeKw: 120,
    city: 'Bhiwandi, MH',
    phaseId: 1,
    phaseName: 'Phase 1: Material Inward & Site Preparation',
    startDate: '2026-10-26',
    endDate: '2026-10-27',
    assignedTeam: 'Team B',
    assignedMemberIds: ['m-deepak', 'm-rakesh'],
    assignedMemberNames: ['Deepak Joshi', 'Rakesh Shinde'],
    status: 'Scheduled',
    notes: 'Unloading 220x Adani 550Wp modules at Bay 4 warehouse yard.'
  },
  {
    id: 'sch-107',
    projectId: 'proj-zenith',
    projectName: 'Zenith Logistics Hub',
    systemSizeKw: 120,
    city: 'Bhiwandi, MH',
    phaseId: 2,
    phaseName: 'Phase 2: Structure & Rail Anchoring',
    startDate: '2026-10-28',
    endDate: '2026-10-31',
    assignedTeam: 'Team B',
    assignedMemberIds: ['m-suresh', 'm-deepak', 'm-arjun'],
    assignedMemberNames: ['Suresh Patil', 'Deepak Joshi', 'Arjun Mehta'],
    status: 'Scheduled',
    notes: 'Aluminium mini-rail clamping on trapezoidal sheet roof.'
  },

  // --- Patil Agro Cold Storage (Team A upcoming) ---
  {
    id: 'sch-108',
    projectId: 'proj-patil',
    projectName: 'Patil Agro Cold Storage',
    systemSizeKw: 25,
    city: 'Baramati, MH',
    phaseId: 1,
    phaseName: 'Phase 1: Material Inward & Site Preparation',
    startDate: '2026-11-01',
    endDate: '2026-11-02',
    assignedTeam: 'Team A',
    assignedMemberIds: ['m-kiran', 'm-sunil'],
    assignedMemberNames: ['Kiran Verma', 'Sunil Yadav'],
    status: 'Scheduled',
    notes: 'Ground mount structural materials dispatch from Pune warehouse.'
  }
];

/**
 * Checks if two date ranges [startA, endA] and [startB, endB] overlap.
 */
export function doDatesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return !(endA < startB || startA > endB);
}

/**
 * Conflict detection engine:
 * Evaluates a proposed phase schedule against all existing schedules.
 * Detects:
 * 1. Specific team member overlaps (e.g. Kiran Verma assigned to two different project locations on the same date).
 * 2. Entire team overlaps (e.g. Team A booked on two projects concurrently).
 */
export function checkScheduleConflicts(
  proposed: {
    id?: string;
    projectId: string;
    projectName: string;
    phaseName: string;
    startDate: string;
    endDate: string;
    assignedTeam: TeamId | 'Mixed';
    assignedMemberIds: string[];
  },
  existingSchedules: PhaseSchedule[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  if (!proposed.startDate || !proposed.endDate || proposed.assignedMemberIds.length === 0) {
    return conflicts;
  }

  // Iterate over existing schedules (excluding self if editing)
  for (const existing of existingSchedules) {
    if (proposed.id && existing.id === proposed.id) continue;
    if (existing.status === 'Completed') continue; // Completed past phases don't conflict with future ones

    // Check date overlap
    if (!doDatesOverlap(proposed.startDate, proposed.endDate, existing.startDate, existing.endDate)) {
      continue;
    }

    // Check individual member overlap across different projects
    if (proposed.projectId !== existing.projectId) {
      for (const memberId of proposed.assignedMemberIds) {
        if (existing.assignedMemberIds.includes(memberId)) {
          const memberObj = FIELD_TEAM_MEMBERS.find(m => m.id === memberId);
          const memberName = memberObj ? memberObj.name : memberId;
          
          const overlapStart = proposed.startDate > existing.startDate ? proposed.startDate : existing.startDate;
          const overlapEnd = proposed.endDate < existing.endDate ? proposed.endDate : existing.endDate;

          conflicts.push({
            id: `conf-${Date.now()}-${memberId}`,
            conflictType: 'member_double_booked',
            memberId,
            memberName,
            team: memberObj?.team,
            existingProject: existing.projectName,
            existingPhase: existing.phaseName,
            existingDates: `${existing.startDate} to ${existing.endDate}`,
            conflictingProject: proposed.projectName,
            conflictingPhase: proposed.phaseName,
            conflictingDates: `${proposed.startDate} to ${proposed.endDate}`,
            overlapDays: `${overlapStart} - ${overlapEnd}`,
            message: `${memberName} is already booked on "${existing.projectName}" (${existing.phaseName}) from ${existing.startDate} to ${existing.endDate}.`
          });
        }
      }

      // Check entire team overlap if not Mixed
      if (
        proposed.assignedTeam !== 'Mixed' &&
        existing.assignedTeam === proposed.assignedTeam
      ) {
        // Only trigger team-level conflict if not already caught on member level
        const alreadyCaught = conflicts.some(c => c.team === proposed.assignedTeam);
        if (!alreadyCaught) {
          const overlapStart = proposed.startDate > existing.startDate ? proposed.startDate : existing.startDate;
          const overlapEnd = proposed.endDate < existing.endDate ? proposed.endDate : existing.endDate;

          conflicts.push({
            id: `conf-team-${Date.now()}`,
            conflictType: 'team_double_booked',
            team: proposed.assignedTeam,
            existingProject: existing.projectName,
            existingPhase: existing.phaseName,
            existingDates: `${existing.startDate} to ${existing.endDate}`,
            conflictingProject: proposed.projectName,
            conflictingPhase: proposed.phaseName,
            conflictingDates: `${proposed.startDate} to ${proposed.endDate}`,
            overlapDays: `${overlapStart} - ${overlapEnd}`,
            message: `${proposed.assignedTeam} is already assigned as a whole crew to "${existing.projectName}" during this window.`
          });
        }
      }
    }
  }

  return conflicts;
}
