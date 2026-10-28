import React, { useState, useMemo } from 'react';
import { UserRole } from '../types/crm';
import { 
  TeamId, 
  ResourceMember, 
  PhaseSchedule, 
  ScheduleConflict 
} from '../types/scheduler';
import { 
  FIELD_TEAM_MEMBERS, 
  INSTALLATION_PHASES, 
  SCHEDULED_PROJECTS, 
  INITIAL_PHASE_SCHEDULES, 
  checkScheduleConflicts 
} from '../data/schedulerData';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  ShieldAlert, 
  Info,
  CalendarCheck,
  ArrowRight,
  Phone,
  Briefcase
} from 'lucide-react';

interface ResourceSchedulerModuleProps {
  userRole: UserRole;
  onOpenRoleMatrix?: () => void;
}

export const ResourceSchedulerModule: React.FC<ResourceSchedulerModuleProps> = ({
  userRole,
  onOpenRoleMatrix
}) => {
  const isCoordinatorOrAdmin = userRole === 'project_coordinator' || userRole === 'admin';

  // Persistence state
  const [schedules, setSchedules] = useState<PhaseSchedule[]>(() => {
    try {
      const saved = localStorage.getItem('solarqube_schedules_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PHASE_SCHEDULES;
  });

  const saveSchedules = (newSchedules: PhaseSchedule[]) => {
    setSchedules(newSchedules);
    try {
      localStorage.setItem('solarqube_schedules_v1', JSON.stringify(newSchedules));
    } catch {}
  };

  // View state: 'timeline' | 'projects' | 'teams'
  const [activeView, setActiveView] = useState<'timeline' | 'projects' | 'teams'>('timeline');

  // Filters
  const [teamFilter, setTeamFilter] = useState<'all' | 'Team A' | 'Team B'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [onlyConflictsFilter, setOnlyConflictsFilter] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);

  // Form State
  const [formProjectId, setFormProjectId] = useState<string>(SCHEDULED_PROJECTS[0].id);
  const [formPhaseId, setFormPhaseId] = useState<number>(1);
  const [formStartDate, setFormStartDate] = useState<string>('2026-10-27');
  const [formEndDate, setFormEndDate] = useState<string>('2026-10-29');
  const [formTeam, setFormTeam] = useState<TeamId | 'Mixed'>('Team A');
  const [formMemberIds, setFormMemberIds] = useState<string[]>(['m-kiran', 'm-vikram']);
  const [formNotes, setFormNotes] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // 14-day timeline range starting 2026-10-22
  const timelineDates = useMemo(() => {
    const dates: { dateStr: string; dayNum: string; dayName: string; isToday: boolean }[] = [];
    const base = new Date('2026-10-22T00:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      dates.push({
        dateStr,
        dayNum: String(d.getDate()).padStart(2, '0'),
        dayName: dayNames[d.getDay()],
        isToday: dateStr === '2026-10-22'
      });
    }
    return dates;
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Compute live conflicts in proposed form
  const liveFormConflicts = useMemo(() => {
    if (!isModalOpen) return [];
    const selectedProj = SCHEDULED_PROJECTS.find(p => p.id === formProjectId);
    const selectedPhase = INSTALLATION_PHASES.find(ph => ph.id === formPhaseId);

    return checkScheduleConflicts(
      {
        id: editingScheduleId || undefined,
        projectId: formProjectId,
        projectName: selectedProj ? selectedProj.name : 'Selected Project',
        phaseName: selectedPhase ? selectedPhase.name : 'Selected Phase',
        startDate: formStartDate,
        endDate: formEndDate,
        assignedTeam: formTeam,
        assignedMemberIds: formMemberIds
      },
      schedules
    );
  }, [
    isModalOpen,
    editingScheduleId,
    formProjectId,
    formPhaseId,
    formStartDate,
    formEndDate,
    formTeam,
    formMemberIds,
    schedules
  ]);

  // All conflicts currently existing across stored schedules
  const allStoredConflicts = useMemo(() => {
    const conflictsList: { scheduleId: string; conflict: ScheduleConflict }[] = [];
    for (const sch of schedules) {
      const confs = checkScheduleConflicts(
        {
          id: sch.id,
          projectId: sch.projectId,
          projectName: sch.projectName,
          phaseName: sch.phaseName,
          startDate: sch.startDate,
          endDate: sch.endDate,
          assignedTeam: sch.assignedTeam,
          assignedMemberIds: sch.assignedMemberIds
        },
        schedules
      );
      if (confs.length > 0) {
        conflictsList.push({ scheduleId: sch.id, conflict: confs[0] });
      }
    }
    return conflictsList;
  }, [schedules]);

  // Filtered schedules for rendering
  const displayedSchedules = useMemo(() => {
    return schedules.filter(sch => {
      if (teamFilter !== 'all' && sch.assignedTeam !== teamFilter && sch.assignedTeam !== 'Mixed') {
        return false;
      }
      if (projectFilter !== 'all' && sch.projectId !== projectFilter) {
        return false;
      }
      if (onlyConflictsFilter) {
        const hasConflict = allStoredConflicts.some(c => c.scheduleId === sch.id);
        if (!hasConflict) return false;
      }
      return true;
    });
  }, [schedules, teamFilter, projectFilter, onlyConflictsFilter, allStoredConflicts]);

  // Reset form to defaults
  const handleOpenAddModal = (presetTeam?: TeamId) => {
    setEditingScheduleId(null);
    setFormProjectId(SCHEDULED_PROJECTS[0].id);
    setFormPhaseId(1);
    setFormStartDate('2026-10-27');
    setFormEndDate('2026-10-29');
    const team = presetTeam || 'Team A';
    setFormTeam(team);
    const teamMembers = FIELD_TEAM_MEMBERS.filter(m => m.team === team).map(m => m.id);
    setFormMemberIds(teamMembers.slice(0, 2));
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleEditSchedule = (sch: PhaseSchedule) => {
    setEditingScheduleId(sch.id);
    setFormProjectId(sch.projectId);
    setFormPhaseId(sch.phaseId);
    setFormStartDate(sch.startDate);
    setFormEndDate(sch.endDate);
    setFormTeam(sch.assignedTeam);
    setFormMemberIds(sch.assignedMemberIds);
    setFormNotes(sch.notes || '');
    setIsModalOpen(true);
  };

  const handleSelectTeamPreset = (team: TeamId) => {
    setFormTeam(team);
    const membersOfTeam = FIELD_TEAM_MEMBERS.filter(m => m.team === team).map(m => m.id);
    setFormMemberIds(membersOfTeam);
  };

  const handleToggleMember = (memberId: string) => {
    setFormMemberIds(prev => {
      const updated = prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId];
      
      const selectedMembers = FIELD_TEAM_MEMBERS.filter(m => updated.includes(m.id));
      const hasTeamA = selectedMembers.some(m => m.team === 'Team A');
      const hasTeamB = selectedMembers.some(m => m.team === 'Team B');
      if (hasTeamA && hasTeamB) {
        setFormTeam('Mixed');
      } else if (hasTeamA) {
        setFormTeam('Team A');
      } else if (hasTeamB) {
        setFormTeam('Team B');
      }
      return updated;
    });
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCoordinatorOrAdmin) {
      showToast('Permission restricted: Only Project Coordinator or Admin can assign schedules.');
      return;
    }

    if (formMemberIds.length === 0) {
      showToast('Please select at least one team member for this phase.');
      return;
    }

    if (liveFormConflicts.length > 0) {
      showToast('⚠️ Cannot save: Please resolve scheduling conflict first.');
      return;
    }

    const selectedProj = SCHEDULED_PROJECTS.find(p => p.id === formProjectId);
    const selectedPhase = INSTALLATION_PHASES.find(ph => ph.id === formPhaseId);
    const memberNames = FIELD_TEAM_MEMBERS
      .filter(m => formMemberIds.includes(m.id))
      .map(m => m.name);

    if (editingScheduleId) {
      const updated = schedules.map(s => {
        if (s.id === editingScheduleId) {
          return {
            ...s,
            projectId: formProjectId,
            projectName: selectedProj ? selectedProj.name : s.projectName,
            systemSizeKw: selectedProj ? selectedProj.capacityKw : s.systemSizeKw,
            city: selectedProj ? selectedProj.city : s.city,
            phaseId: formPhaseId,
            phaseName: selectedPhase ? selectedPhase.name : s.phaseName,
            startDate: formStartDate,
            endDate: formEndDate,
            assignedTeam: formTeam,
            assignedMemberIds: formMemberIds,
            assignedMemberNames: memberNames,
            notes: formNotes
          };
        }
        return s;
      });
      saveSchedules(updated);
      showToast(`Updated assignment for ${selectedProj?.name}`);
    } else {
      const newSch: PhaseSchedule = {
        id: `sch-${Date.now()}`,
        projectId: formProjectId,
        projectName: selectedProj ? selectedProj.name : 'New Project',
        systemSizeKw: selectedProj ? selectedProj.capacityKw : 10,
        city: selectedProj ? selectedProj.city : 'Bengaluru',
        phaseId: formPhaseId,
        phaseName: selectedPhase ? selectedPhase.name : 'Installation Phase',
        startDate: formStartDate,
        endDate: formEndDate,
        assignedTeam: formTeam,
        assignedMemberIds: formMemberIds,
        assignedMemberNames: memberNames,
        status: 'Scheduled',
        notes: formNotes
      };
      saveSchedules([newSch, ...schedules]);
      showToast(`Scheduled ${selectedPhase?.shortName} for ${selectedProj?.name}`);
    }

    setIsModalOpen(false);
  };

  const handleUpdateStatus = (scheduleId: string, newStatus: PhaseSchedule['status']) => {
    if (!isCoordinatorOrAdmin) {
      showToast('Only Project Coordinator can update installation progress.');
      return;
    }
    const updated = schedules.map(s => (s.id === scheduleId ? { ...s, status: newStatus } : s));
    saveSchedules(updated);
    showToast(`Status updated to ${newStatus}`);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (!isCoordinatorOrAdmin) return;
    const updated = schedules.filter(s => s.id !== scheduleId);
    saveSchedules(updated);
    setIsModalOpen(false);
    showToast('Assignment removed from schedule.');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Notice for Field Staff */}
      {!isCoordinatorOrAdmin && (
        <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs text-brand-800 dark:text-brand-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>
              <strong>View Mode:</strong> You are logged in as {userRole.replace('_', ' ').toUpperCase()}. Phase allocations are managed by <strong>Rajesh Menon (Project Coordinator)</strong>.
            </span>
          </div>
          {onOpenRoleMatrix && (
            <button
              onClick={onOpenRoleMatrix}
              className="text-[12px] underline font-bold cursor-pointer hover:text-brand-900 dark:hover:text-brand-200"
            >
              View Permissions
            </button>
          )}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Resource Scheduler</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20 font-bold">
              Team A & Team B
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Assign field technicians to installation phases across project dates with automated conflict prevention.
          </p>
        </div>

        {/* Primary Action Button */}
        {isCoordinatorOrAdmin && (
          <button
            onClick={() => handleOpenAddModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Phase</span>
          </button>
        )}
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Team A Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Team A (Lead: Kiran Verma)</span>
            </span>
            <span className="text-[12px] text-slate-500 font-mono">4 Crew</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Site:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Apex Spintex 75 kWp</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Phase:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">Structure Erection</span>
            </div>
          </div>
          {isCoordinatorOrAdmin && (
            <button
              onClick={() => handleOpenAddModal('Team A')}
              className="text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>+ Assign Team A</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Team B Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Team B (Lead: Suresh Patil)</span>
            </span>
            <span className="text-[12px] text-slate-500 font-mono">4 Crew</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Site:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Arvind Rao Villa 10 kWp</span>
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Phase:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Panel Clamping</span>
            </div>
          </div>
          {isCoordinatorOrAdmin && (
            <button
              onClick={() => handleOpenAddModal('Team B')}
              className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
            >
              <span>+ Assign Team B</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Conflict Protection Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Conflict Guard</span>
            </span>
            {allStoredConflicts.length === 0 ? (
              <span className="text-[12px] text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Clear</span>
              </span>
            ) : (
              <span className="text-[12px] text-rose-600 dark:text-rose-400 font-mono font-bold">
                {allStoredConflicts.length} Alert{allStoredConflicts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {allStoredConflicts.length === 0
              ? 'No scheduling clashes. Double-booking protection active across all dates.'
              : 'Potential date overlap detected in assignments.'}
          </p>
          {allStoredConflicts.length > 0 && (
            <button
              onClick={() => setOnlyConflictsFilter(!onlyConflictsFilter)}
              className="text-[12px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{onlyConflictsFilter ? 'Show All Schedules' : 'Filter Overlaps Only'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>

      {/* View Switcher & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl">
        
        {/* View Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'timeline'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            14-Day Timeline
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'projects'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Project Phases
          </button>
          <button
            onClick={() => setActiveView('teams')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeView === 'teams'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Team Roster (8)
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Teams</option>
            <option value="Team A">Team A (Kiran)</option>
            <option value="Team B">Team B (Suresh)</option>
          </select>

          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">All Projects</option>
            {SCHEDULED_PROJECTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW 1: 14-DAY TIMELINE */}
      {activeView === 'timeline' && (
        <div className="space-y-4">
          
          {/* Visual Day Header Matrix */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
                <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">
                  October - November 2026 Schedule Window
                </span>
                <div className="flex items-center gap-3 text-[12px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" />
                    <span>Team A (Kiran)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                    <span>Team B (Suresh)</span>
                  </span>
                </div>
              </div>

              {/* Day Bar */}
              <div className="grid grid-cols-14 gap-1 text-center font-mono text-[12px]">
                {timelineDates.map(d => (
                  <div
                    key={d.dateStr}
                    className={`py-1.5 px-0.5 rounded-lg border transition-colors ${
                      d.isToday
                        ? 'bg-brand-500/10 border-brand-500/30 text-brand-700 dark:text-brand-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="text-[11px] uppercase text-slate-500">{d.dayName}</div>
                    <div className="text-xs font-semibold">{d.dayNum}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule Assignments by Team */}
          <div className="space-y-4">
            
            {/* Team A Section */}
            {(teamFilter === 'all' || teamFilter === 'Team A') && (
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Team A Phase Assignments
                    </span>
                    <span className="text-[12px] text-slate-500">
                      Lead: Kiran Verma · Site Eng: Vikram Rao
                    </span>
                  </div>
                  {isCoordinatorOrAdmin && (
                    <button
                      onClick={() => handleOpenAddModal('Team A')}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      + Add Phase
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {displayedSchedules.filter(s => s.assignedTeam === 'Team A').length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-500">
                      No phases scheduled for Team A. Click "+ Add Phase" to assign.
                    </div>
                  ) : (
                    displayedSchedules
                      .filter(s => s.assignedTeam === 'Team A')
                      .map(sch => {
                        const hasConflict = allStoredConflicts.some(c => c.scheduleId === sch.id);
                        return (
                          <div
                            key={sch.id}
                            className={`p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                              hasConflict ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                  {sch.projectName}
                                </span>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                                  {sch.phaseName}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  ({sch.systemSizeKw} kWp · {sch.city})
                                </span>
                                {hasConflict && (
                                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold border border-rose-500/30">
                                    Overlapping Date Conflict
                                  </span>
                                )}
                              </div>

                              <div className="text-[12px] text-slate-500 flex items-center gap-2 flex-wrap">
                                <span>
                                  Dates: <strong className="text-slate-800 dark:text-slate-200 font-mono">{sch.startDate}</strong> to <strong className="text-slate-800 dark:text-slate-200 font-mono">{sch.endDate}</strong>
                                </span>
                                <span>·</span>
                                <span>
                                  Technicians: <strong className="text-slate-800 dark:text-slate-200">{sch.assignedMemberNames.join(', ')}</strong>
                                </span>
                              </div>

                              {sch.notes && (
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                                  "{sch.notes}"
                                </p>
                              )}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                              <select
                                value={sch.status}
                                disabled={!isCoordinatorOrAdmin}
                                onChange={e => handleUpdateStatus(sch.id, e.target.value as any)}
                                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
                              >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Delayed">Delayed</option>
                              </select>

                              {isCoordinatorOrAdmin && (
                                <button
                                  onClick={() => handleEditSchedule(sch)}
                                  className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {/* Team B Section */}
            {(teamFilter === 'all' || teamFilter === 'Team B') && (
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Team B Phase Assignments
                    </span>
                    <span className="text-[12px] text-slate-500">
                      Lead: Suresh Patil · Eng: Arjun Mehta
                    </span>
                  </div>
                  {isCoordinatorOrAdmin && (
                    <button
                      onClick={() => handleOpenAddModal('Team B')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      + Add Phase
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {displayedSchedules.filter(s => s.assignedTeam === 'Team B').length === 0 ? (
                    <div className="p-5 text-center text-xs text-slate-500">
                      No phases scheduled for Team B. Click "+ Add Phase" to assign.
                    </div>
                  ) : (
                    displayedSchedules
                      .filter(s => s.assignedTeam === 'Team B')
                      .map(sch => {
                        const hasConflict = allStoredConflicts.some(c => c.scheduleId === sch.id);
                        return (
                          <div
                            key={sch.id}
                            className={`p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                              hasConflict ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                  {sch.projectName}
                                </span>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                  {sch.phaseName}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  ({sch.systemSizeKw} kWp · {sch.city})
                                </span>
                                {hasConflict && (
                                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 font-bold border border-rose-500/30">
                                    Overlapping Date Conflict
                                  </span>
                                )}
                              </div>

                              <div className="text-[12px] text-slate-500 flex items-center gap-2 flex-wrap">
                                <span>
                                  Dates: <strong className="text-slate-800 dark:text-slate-200 font-mono">{sch.startDate}</strong> to <strong className="text-slate-800 dark:text-slate-200 font-mono">{sch.endDate}</strong>
                                </span>
                                <span>·</span>
                                <span>
                                  Technicians: <strong className="text-slate-800 dark:text-slate-200">{sch.assignedMemberNames.join(', ')}</strong>
                                </span>
                              </div>

                              {sch.notes && (
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                                  "{sch.notes}"
                                </p>
                              )}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                              <select
                                value={sch.status}
                                disabled={!isCoordinatorOrAdmin}
                                onChange={e => handleUpdateStatus(sch.id, e.target.value as any)}
                                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 cursor-pointer font-medium"
                              >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Delayed">Delayed</option>
                              </select>

                              {isCoordinatorOrAdmin && (
                                <button
                                  onClick={() => handleEditSchedule(sch)}
                                  className="px-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* VIEW 2: PROJECT PHASES BOARD */}
      {activeView === 'projects' && (
        <div className="space-y-4">
          {SCHEDULED_PROJECTS.map(proj => {
            const projSchedules = displayedSchedules.filter(s => s.projectId === proj.id);
            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs"
              >
                {/* Project Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{proj.name}</span>
                      <span className="text-xs font-mono font-normal text-slate-500">
                        ({proj.capacityKw} kWp · {proj.city})
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {projSchedules.length} of 7 Phases Scheduled
                    </span>
                    {isCoordinatorOrAdmin && (
                      <button
                        onClick={() => {
                          setFormProjectId(proj.id);
                          handleOpenAddModal();
                        }}
                        className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Phase</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Phases List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {projSchedules.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No phases scheduled yet for this project. Click "+ Add Phase" to assign Team A or Team B.
                    </div>
                  ) : (
                    projSchedules.map(sch => (
                      <div
                        key={sch.id}
                        className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {sch.phaseName}
                            </span>
                            <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                              sch.assignedTeam === 'Team A'
                                ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            }`}>
                              {sch.assignedTeam}
                            </span>
                          </div>
                          <div className="text-[12px] text-slate-500 flex items-center gap-2">
                            <span>Dates: <strong className="text-slate-700 dark:text-slate-300 font-mono">{sch.startDate}</strong> to <strong className="text-slate-700 dark:text-slate-300 font-mono">{sch.endDate}</strong></span>
                            <span>·</span>
                            <span>Assigned: <strong className="text-slate-800 dark:text-slate-200">{sch.assignedMemberNames.join(', ')}</strong></span>
                          </div>
                          {sch.notes && (
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                              "{sch.notes}"
                            </p>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={sch.status}
                            disabled={!isCoordinatorOrAdmin}
                            onChange={e => handleUpdateStatus(sch.id, e.target.value as any)}
                            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                          </select>

                          {isCoordinatorOrAdmin && (
                            <button
                              onClick={() => handleEditSchedule(sch)}
                              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: TEAM ROSTER */}
      {activeView === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Team A Roster */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Team A (4 Technicians)</span>
                </h3>
                <p className="text-xs text-slate-500">Civil Mounting & Rooftop Structure Erection</p>
              </div>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                Lead: Kiran Verma
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
              {FIELD_TEAM_MEMBERS.filter(m => m.team === 'Team A').map(member => (
                <div key={member.id} className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {member.name} {member.isLead && <span className="text-[11px] text-blue-600 font-mono">(Lead)</span>}
                    </span>
                    <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      member.activeStatus === 'On Site'
                        ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {member.activeStatus}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    <span>{member.role}</span>
                    <span>·</span>
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{member.phone}</span>
                  </p>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400">{member.specialization}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team B Roster */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Team B (4 Technicians)</span>
                </h3>
                <p className="text-xs text-slate-500">Electrical AC/DC & DISCOM Net-Metering</p>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                Lead: Suresh Patil
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
              {FIELD_TEAM_MEMBERS.filter(m => m.team === 'Team B').map(member => (
                <div key={member.id} className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {member.name} {member.isLead && <span className="text-[11px] text-emerald-600 font-mono">(Lead)</span>}
                    </span>
                    <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      member.activeStatus === 'On Site'
                        ? 'bg-brand-500/10 text-brand-700 dark:text-brand-400'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {member.activeStatus}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    <span>{member.role}</span>
                    <span>·</span>
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{member.phone}</span>
                  </p>
                  <p className="text-[12px] text-slate-600 dark:text-slate-400">{member.specialization}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SCHEDULE PHASE MODAL WITH LIVE CONFLICT DETECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#0a0f2a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-brand-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingScheduleId ? 'Edit Installation Phase Assignment' : 'Assign Team to Installation Phase'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSchedule} className="p-5 space-y-4">
              
              {/* 1. Project Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Solar Project
                </label>
                <select
                  value={formProjectId}
                  onChange={e => setFormProjectId(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  {SCHEDULED_PROJECTS.map(proj => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.capacityKw} kWp · {proj.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Installation Phase Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Installation Phase (1 to 7)
                </label>
                <select
                  value={formPhaseId}
                  onChange={e => setFormPhaseId(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium cursor-pointer"
                >
                  {INSTALLATION_PHASES.map(ph => (
                    <option key={ph.id} value={ph.id}>
                      {ph.name} ({ph.standardDurationDays} Days std.)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Date Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              {/* 4. Team & Member Selection */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Assign Technicians
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectTeamPreset('Team A')}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30 hover:bg-blue-500/20 cursor-pointer"
                    >
                      Team A
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTeamPreset('Team B')}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                    >
                      Team B
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl">
                  {FIELD_TEAM_MEMBERS.map(m => {
                    const isSelected = formMemberIds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? m.team === 'Team A'
                              ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold'
                              : 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleMember(m.id)}
                            className="rounded text-brand-500 focus:ring-0 cursor-pointer"
                          />
                          <span className="truncate">{m.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {m.team.split(' ')[1]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* LIVE CONFLICT DETECTION BANNER */}
              {liveFormConflicts.length > 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Double-Booking Conflict!</span>
                  </div>
                  {liveFormConflicts.map((conf, idx) => (
                    <p key={idx} className="text-[12px] leading-relaxed pl-5">
                      • <strong>{conf.memberName || conf.team}</strong> is already booked on <em>"{conf.existingProject}"</em> ({conf.existingPhase}) on <span className="font-mono">{conf.existingDates}</span>.
                    </p>
                  ))}
                  <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 pt-0.5 pl-5">
                    Adjust dates or assign another technician to save.
                  </div>
                </div>
              ) : formMemberIds.length > 0 ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    No conflict detected. Selected crew is available for these dates.
                  </span>
                </div>
              ) : null}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Execution Notes (Optional)
                </label>
                <textarea
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="e.g. Verify anchor torque test before panel clamping..."
                  rows={2}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {editingScheduleId && isCoordinatorOrAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSchedule(editingScheduleId)}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Delete Assignment
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={liveFormConflicts.length > 0 || formMemberIds.length === 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      liveFormConflicts.length > 0 || formMemberIds.length === 0
                        ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm cursor-pointer'
                    }`}
                  >
                    {editingScheduleId ? 'Save Changes' : 'Confirm Assignment'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
