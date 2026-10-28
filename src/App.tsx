/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  SolarLead, 
  PipelineStage, 
  LostReason, 
  FollowUpTask, 
  UserRole,
  SiteSurveyData,
  ProposalVersion,
  InstallationChecklistStep,
  PaymentMilestone,
  SubsidyAndNetMetering
} from './types/crm';
import { EmailSequence } from './types/automation';
import { 
  INITIAL_LEADS, 
  INITIAL_TASKS, 
  INITIAL_SEQUENCES, 
  PIPELINE_STAGES, 
  TEAM_MEMBERS 
} from './data/initialData';
import { isTabAllowed, getDefaultTabForRole, canViewFinancials } from './utils/rbac';

import { Sidebar, MainNavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { CommandPalette } from './components/CommandPalette';

import { DashboardView } from './components/DashboardView';
import { LeadsView } from './components/LeadsView';
import { PipelineView } from './components/PipelineView';
import { SiteSurveyModule } from './components/SiteSurveyModule';
import { QuotationModule } from './components/QuotationModule';
import { ProjectDeliveryModule } from './components/ProjectDeliveryModule';
import { AfterSalesModule } from './components/AfterSalesModule';
import { CommunicationModule } from './components/CommunicationModule';
import { SolarCalculatorView } from './components/SolarCalculatorView';
import { AttendanceModule } from './components/AttendanceModule';
import { ResourceSchedulerModule } from './components/ResourceSchedulerModule';

import { LeadDetailModal } from './components/LeadDetailModal';
import { NewLeadModal } from './components/NewLeadModal';
import { ComposeEmailModal } from './components/ComposeEmailModal';
import { TasksRemindersModal } from './components/TasksRemindersModal';
import { WebsiteFormModal } from './components/WebsiteFormModal';
import { ImportExportModal } from './components/ImportExportModal';
import { RoleAccessMatrixModal } from './components/RoleAccessMatrixModal';
import { LoginView } from './components/LoginView';
import { AuthUser, getUserForRole } from './data/authUsers';

import confetti from 'canvas-confetti';
import { Check, AlertCircle, ShieldCheck } from 'lucide-react';

const STORAGE_LEADS_KEY = 'solarqube_crm_leads_v2';
const STORAGE_TASKS_KEY = 'solarqube_crm_tasks_v2';
const STORAGE_ROLE_KEY = 'solarqube_crm_role_v2';
const STORAGE_THEME_KEY = 'solarqube_crm_theme_v2';
const STORAGE_ASSIGNED_FILTER_KEY = 'solarqube_crm_assigned_filter_v2';
const STORAGE_AUTH_USER_KEY = 'solarqube_auth_user_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<MainNavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Theme state: 'daylight' (clean modern light) or 'obsidian' (deep solar dark)
  const [theme, setTheme] = useState<'daylight' | 'obsidian'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'obsidian' || saved === 'daylight') return saved;
    } catch {}
    return 'daylight';
  });

  // Auth state: separate login for all roles
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Role state (synced with authenticated user)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_AUTH_USER_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.role) return parsed.role as UserRole;
      }
      const saved = localStorage.getItem(STORAGE_ROLE_KEY);
      if (saved) return saved as UserRole;
    } catch {}
    return 'admin';
  });

  // Assigned-only filter (answers "all datas visible to all roles?")
  const [assignedOnlyFilter, setAssignedOnlyFilter] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ASSIGNED_FILTER_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return false;
  });

  // Modal for RBAC & Data Visibility Policy
  const [showRoleMatrixModal, setShowRoleMatrixModal] = useState(false);

  // Sync theme with HTML document class
  useEffect(() => {
    if (theme === 'obsidian') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // Sync assigned filter
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ASSIGNED_FILTER_KEY, JSON.stringify(assignedOnlyFilter));
    } catch {}
  }, [assignedOnlyFilter]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'daylight' ? 'obsidian' : 'daylight'));
    showToast(`Switched design to Solar ${theme === 'daylight' ? 'Obsidian' : 'Daylight'} mode`);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    const updatedUser = getUserForRole(newRole);
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_ROLE_KEY, newRole);
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(updatedUser));
    } catch {}
    if (!isTabAllowed(newRole, currentTab)) {
      const fallbackTab = getDefaultTabForRole(newRole);
      setCurrentTab(fallbackTab);
    }
    showToast(`Switched active profile to ${newRole.replace('_', ' ').toUpperCase()}`);
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    try {
      localStorage.setItem(STORAGE_AUTH_USER_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_ROLE_KEY, user.role);
    } catch {}
    const defaultTab = getDefaultTabForRole(user.role);
    setCurrentTab(defaultTab);
    showToast(`Signed in as ${user.name} (${user.badgeLabel})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTH_USER_KEY);
    } catch {}
    showToast('Signed out. Choose your role to log in.');
  };

  // Leads state
  const [leads, setLeads] = useState<SolarLead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LEADS;
  });

  // Tasks state
  const [tasks, setTasks] = useState<FollowUpTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TASKS;
  });

  // Filter leads if assignedOnlyFilter is active
  const scopedLeads = useMemo(() => {
    if (!assignedOnlyFilter) return leads;
    if (userRole === 'site_engineer') {
      return leads.filter(l => l.assignedTo === 'Vikram Rao' || l.siteSurvey?.engineerName === 'Vikram Rao');
    }
    if (userRole === 'installer') {
      return leads.filter(l => 
        l.assignedTo === 'Kiran Verma' || 
        l.stage === 'won' || 
        l.stage === 'negotiation' || 
        l.installationSteps.some(s => s.assignedTeam?.includes('Kiran'))
      );
    }
    if (userRole === 'sales') {
      return leads.filter(l => l.assignedTo === 'Ananya Sharma');
    }
    return leads;
  }, [leads, assignedOnlyFilter, userRole]);

  // Sequences
  const [sequences, setSequences] = useState<EmailSequence[]>(INITIAL_SEQUENCES);

  // Modals state
  const [selectedLeadForDossier, setSelectedLeadForDossier] = useState<SolarLead | null>(null);
  const [leadForEmailComposer, setLeadForEmailComposer] = useState<SolarLead | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showWebsiteFormModal, setShowWebsiteFormModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch {}
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ROLE_KEY, userRole);
    } catch {}
  }, [userRole]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  // Lead update
  const handleUpdateLead = (updatedLead: SolarLead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
    if (selectedLeadForDossier && selectedLeadForDossier.id === updatedLead.id) {
      setSelectedLeadForDossier(updatedLead);
    }
    showToast(`Updated record for ${updatedLead.customerName}`);
  };

  // Stage update (with optional lost reason)
  const handleUpdateLeadStage = (
    leadId: string, 
    newStage: PipelineStage, 
    lostReason?: LostReason,
    lostNotes?: string
  ) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      stage: newStage,
      lostReason: newStage === 'lost' ? lostReason : undefined,
      lostNotes: newStage === 'lost' ? lostNotes : undefined,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'stage_change',
          author: userRole === 'admin' ? 'Sneha Patel' : userRole === 'sales' ? 'Ananya Sharma' : userRole === 'site_engineer' ? 'Vikram Rao' : 'Kiran Verma',
          role: userRole,
          title: `Moved to ${newStage.toUpperCase().replace('_', ' ')}`,
          description: newStage === 'lost' 
            ? `Reason: ${lostReason || 'Not specified'}. Notes: ${lostNotes || 'None'}` 
            : `Deal advanced by ${userRole}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        },
        ...lead.activities
      ]
    };

    handleUpdateLead(updated);

    if (newStage === 'won') {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}
      showToast(`🎉 Turnkey EPC Contract WON for ${lead.customerName}!`);
    } else if (newStage === 'lost') {
      showToast(`Logged lost deal for ${lead.customerName} (${lostReason})`);
    } else {
      showToast(`Moved ${lead.customerName} to ${newStage.replace('_', ' ')}`);
    }
  };

  // Add new lead
  const handleAddLead = (newLeadData: Partial<SolarLead>) => {
    const newId = `SQ-2026-${String(leads.length + 101).padStart(3, '0')}`;
    const fullLead: SolarLead = {
      id: newId,
      customerName: newLeadData.customerName || 'Customer',
      phone: newLeadData.phone || '+91 98000 00000',
      email: newLeadData.email || 'customer@example.com',
      address: newLeadData.address || 'Address',
      city: newLeadData.city || 'Bengaluru',
      state: newLeadData.state || 'Karnataka',
      propertyType: newLeadData.propertyType || 'Home / Villa',
      monthlyBill: newLeadData.monthlyBill || 5000,
      roofAreaSqFt: newLeadData.roofAreaSqFt || 800,
      customerBudget: newLeadData.customerBudget,
      roofType: newLeadData.roofType || 'RCC Flat Roof',
      systemType: newLeadData.systemType || 'On-Grid',
      stage: 'new',
      source: newLeadData.source || 'Website Form',
      assignedTo: newLeadData.assignedTo || 'Ananya Sharma',
      createdDate: new Date().toISOString().slice(0, 10),
      lastContactedDate: new Date().toISOString().slice(0, 10),
      recommendedCapacityKw: newLeadData.recommendedCapacityKw || 5,
      estimatedQuoteValue: newLeadData.estimatedQuoteValue || 320000,
      estimatedSubsidyAmount: newLeadData.estimatedSubsidyAmount || 78000,
      netPayableAmount: newLeadData.netPayableAmount || 242000,
      estimatedAnnualSavings: Math.round((newLeadData.recommendedCapacityKw || 5) * 1400 * 8.5),
      estimatedPaybackYears: 3.5,
      untouchedAlert: false,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'System Intake',
          role: 'system',
          title: 'Lead Captured',
          description: `Captured via ${newLeadData.source || 'Direct Intake'}. Auto-assigned to ${newLeadData.assignedTo || 'Ananya Sharma'}.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      ],
      priority: 'High',
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      documents: [],
      proposals: [],
      installationSteps: [
        { id: 'step-1', title: 'Material Dispatch & BOS Delivery', description: 'Modules, inverter and structures dispatch from warehouse', completed: false, assignedTeam: 'Kiran Verma & Dispatch Logistics', photoUploaded: false },
        { id: 'step-2', title: 'HDGI Mounting Structure Erection', description: 'Rooftop mounting anchoring with chemical grouting', completed: false, assignedTeam: 'Kiran Verma & Erection Crew', photoUploaded: false },
        { id: 'step-3', title: 'Mono PERC/TOPCon Panel Installation', description: 'Module mounting and torque check with mid/end clamps', completed: false, assignedTeam: 'Kiran Verma & Crew', photoUploaded: false },
        { id: 'step-4', title: 'DCDB, ACDB & Earthing Pit Wiring', description: 'SPD protection and copper/GI earthing strip connection', completed: false, assignedTeam: 'Kiran Verma & Certified Wiremen', photoUploaded: false },
        { id: 'step-5', title: 'Grid-Tie Inverter Setup & Testing', description: 'String inverter mounting, polarity check and idle test', completed: false, assignedTeam: 'Vikram Rao & Kiran Verma', photoUploaded: false },
        { id: 'step-6', title: 'CEIG & Electrical Inspector Approval', description: 'Regulatory safety verification and approval document', completed: false, assignedTeam: 'Vikram Rao (CAD / CEIG Liaison)', photoUploaded: false },
        { id: 'step-7', title: 'Bi-directional Net-Meter Energization', description: 'DISCOM bidirectional meter swap and plant synchronization', completed: false, assignedTeam: 'Kiran Verma & DISCOM Lineman', photoUploaded: false }
      ],
      payments: [
        { id: 'pay-1', title: 'Advance on Token Booking (10%)', amount: Math.round((newLeadData.netPayableAmount || 242000) * 0.1), status: 'Paid', dueDate: new Date().toISOString().slice(0, 10), paidDate: new Date().toISOString().slice(0, 10) },
        { id: 'pay-2', title: 'Before Material Dispatch (60%)', amount: Math.round((newLeadData.netPayableAmount || 242000) * 0.6), status: 'Pending', dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10) },
        { id: 'pay-3', title: 'Post Mechanical Installation (20%)', amount: Math.round((newLeadData.netPayableAmount || 242000) * 0.2), status: 'Pending', dueDate: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10) },
        { id: 'pay-4', title: 'Final Net-Meter Commissioning (10%)', amount: Math.round((newLeadData.netPayableAmount || 242000) * 0.1), status: 'Pending', dueDate: new Date(Date.now() + 86400000 * 21).toISOString().slice(0, 10) }
      ]
    };

    setLeads(prev => [fullLead, ...prev]);
    showToast(`Created new lead: ${fullLead.customerName} (${fullLead.recommendedCapacityKw} kWp)`);
  };

  // Email sending
  const handleSendEmail = (leadId: string, subject: string, body: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      lastContactedDate: new Date().toISOString().slice(0, 10),
      untouchedAlert: false,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'email',
          author: userRole === 'admin' ? 'Sneha Patel' : 'Ananya Sharma',
          role: userRole,
          title: `Email Sent: ${subject}`,
          description: body.slice(0, 140) + '...',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        },
        ...lead.activities
      ]
    };

    handleUpdateLead(updated);
    showToast(`Sent email to ${lead.email}`);
  };

  // WhatsApp trigger simulation
  const handleTriggerWhatsAppLog = (leadId: string, message: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      lastContactedDate: new Date().toISOString().slice(0, 10),
      untouchedAlert: false,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'whatsapp',
          author: 'Automated Drip / WhatsApp API',
          role: 'automation',
          title: 'WhatsApp Follow-Up Dispatched',
          description: message.slice(0, 120) + '...',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        },
        ...lead.activities
      ]
    };

    handleUpdateLead(updated);
    showToast(`WhatsApp dispatched to ${lead.phone}`);
  };

  // Task toggle
  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add task
  const handleAddTask = (newTaskData: Omit<FollowUpTask, 'id' | 'completed'>) => {
    const task: FollowUpTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false
    };
    setTasks(prev => [task, ...prev]);
    showToast(`Scheduled reminder: ${task.title}`);
  };

  // Site survey update
  const handleUpdateLeadSurvey = (leadId: string, surveyData: SiteSurveyData) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      siteSurvey: surveyData,
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'site_visit',
          author: surveyData.engineerName || 'Vikram Rao',
          role: 'site_engineer',
          title: `Site Survey ${surveyData.status}`,
          description: `Measurements: ${surveyData.roofLengthFt}x${surveyData.roofWidthFt}ft (${surveyData.usableAreaSqFt} sq.ft), Shading: ${surveyData.shadingAssessment}, Tilt: ${surveyData.tiltAngleDeg}°`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        },
        ...lead.activities
      ]
    };

    handleUpdateLead(updated);
    showToast(`Saved site survey measurements for ${lead.customerName}`);
  };

  // Quotation proposals
  const handleAddProposalVersion = (leadId: string, newVersion: ProposalVersion) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      netPayableAmount: newVersion.netPrice,
      estimatedSubsidyAmount: newVersion.subsidyAmount,
      proposals: [newVersion, ...lead.proposals],
      activities: [
        {
          id: `act-${Date.now()}`,
          type: 'note',
          author: 'Ananya Sharma',
          role: 'sales',
          title: `Generated Quote ${newVersion.versionNumber}`,
          description: `${newVersion.systemSizeKw}kWp · Net ₹${newVersion.netPrice.toLocaleString()} · ${newVersion.panelBrand} / ${newVersion.inverterBrand}`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        },
        ...lead.activities
      ]
    };

    handleUpdateLead(updated);
    showToast(`Published quote ${newVersion.versionNumber} for ${lead.customerName}`);
  };

  const handleUpdateProposalStatus = (leadId: string, versionId: string, status: ProposalVersion['status']) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      proposals: lead.proposals.map(p =>
        p.id === versionId
          ? {
              ...p,
              status,
              openedCount: status === 'Viewed by Customer' ? p.openedCount + 1 : p.openedCount
            }
          : p
      )
    };

    handleUpdateLead(updated);
    showToast(`Quotation status updated to ${status}`);
  };

  // Installation steps
  const handleUpdateLeadInstallation = (leadId: string, steps: InstallationChecklistStep[]) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      installationSteps: steps
    };

    handleUpdateLead(updated);
    showToast(`Installation checklist saved for ${lead.customerName}`);
  };

  // Payment milestones
  const handleUpdateLeadPayment = (leadId: string, milestones: PaymentMilestone[]) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      payments: milestones
    };

    handleUpdateLead(updated);
    showToast(`Payment ledger updated for ${lead.customerName}`);
  };

  // Subsidy tracker
  const handleUpdateLeadSubsidy = (leadId: string, subsidy: SubsidyAndNetMetering) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const updated: SolarLead = {
      ...lead,
      subsidyTracker: subsidy
    };

    handleUpdateLead(updated);
    showToast(`DISCOM Net-meter status saved for ${lead.customerName}`);
  };

  // CSV Import
  const handleImportLeads = (imported: SolarLead[]) => {
    setLeads(prev => [...imported, ...prev]);
    showToast(`Imported ${imported.length} new leads into CRM`);
  };

  // Restore backup
  const handleRestoreBackup = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (parsed.leads && Array.isArray(parsed.leads)) {
        setLeads(parsed.leads);
        showToast(`Restored database snapshot (${parsed.leads.length} leads)`);
      }
    } catch {
      alert('Invalid JSON file format.');
    }
  };

  const untouchedCount = leads.filter(l => l.untouchedAlert || l.stage === 'new').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const activeLeads = leads.filter(l => l.stage !== 'lost');
  const totalCapacityKw = activeLeads.reduce((s, l) => s + l.recommendedCapacityKw, 0);
  const totalPipelineValue = activeLeads.reduce(
    (sum, l) => sum + (l.netPayableAmount || l.estimatedQuoteValue),
    0
  );

  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'obsidian' ? 'dark' : ''} bg-slate-50 dark:bg-[#080c22] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-500/30 selection:text-brand-800 transition-colors`}>
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        leadsCount={leads.length}
        pendingTasksCount={pendingTasksCount}
        untouchedAlertCount={untouchedCount}
        userRole={userRole}
        onChangeUserRole={handleRoleChange}
        onOpenTasksModal={() => setShowTasksModal(true)}
        onOpenWebsiteForm={() => setShowWebsiteFormModal(true)}
        onOpenImportExport={() => setShowImportExportModal(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Context Navigation */}
        <TopNav
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewLead={() => setShowNewLeadModal(true)}
          onOpenTasksModal={() => setShowTasksModal(true)}
          onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
          pendingTasksCount={pendingTasksCount}
          untouchedAlertCount={untouchedCount}
          totalCapacityKw={totalCapacityKw}
          totalPipelineValue={totalPipelineValue}
          userRole={userRole}
          onChangeUserRole={handleRoleChange}
          assignedOnlyFilter={assignedOnlyFilter}
          onToggleAssignedOnlyFilter={setAssignedOnlyFilter}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Viewport View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <DashboardView
              leads={scopedLeads}
              userRole={userRole}
              assignedOnlyFilter={assignedOnlyFilter}
              onSelectLead={setSelectedLeadForDossier}
              onOpenEmailComposer={setLeadForEmailComposer}
              onNavigateTab={setCurrentTab}
              onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
            />
          )}

          {currentTab === 'leads' && (
            <LeadsView
              leads={scopedLeads}
              userRole={userRole}
              assignedOnlyFilter={assignedOnlyFilter}
              onSelectLead={setSelectedLeadForDossier}
              onOpenEmailComposer={setLeadForEmailComposer}
              onOpenNewLead={() => setShowNewLeadModal(true)}
              onUpdateLeadStage={(id, st) => handleUpdateLeadStage(id, st)}
              onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
            />
          )}

          {currentTab === 'pipeline' && (
            <PipelineView
              leads={scopedLeads}
              userRole={userRole}
              assignedOnlyFilter={assignedOnlyFilter}
              onSelectLead={setSelectedLeadForDossier}
              onOpenEmailComposer={setLeadForEmailComposer}
              onUpdateLeadStage={handleUpdateLeadStage}
              onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
            />
          )}

          {currentTab === 'survey' && (
            <SiteSurveyModule
              leads={scopedLeads}
              userRole={userRole}
              onUpdateLeadSurvey={handleUpdateLeadSurvey}
            />
          )}

          {currentTab === 'quotations' && (
            <QuotationModule
              leads={scopedLeads}
              onAddProposalVersion={handleAddProposalVersion}
              onUpdateProposalStatus={handleUpdateProposalStatus}
            />
          )}

          {currentTab === 'delivery' && (
            <ProjectDeliveryModule
              leads={scopedLeads}
              userRole={userRole}
              onUpdateLeadInstallation={handleUpdateLeadInstallation}
              onUpdateLeadPayment={handleUpdateLeadPayment}
              onUpdateLeadSubsidy={handleUpdateLeadSubsidy}
            />
          )}

          {currentTab === 'schedule' && (
            <ResourceSchedulerModule
              userRole={userRole}
              onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
            />
          )}

          {currentTab === 'aftersales' && (
            <AfterSalesModule
              leads={scopedLeads}
            />
          )}

          {currentTab === 'automations' && (
            <CommunicationModule
              leads={scopedLeads}
              onTriggerWhatsAppLog={handleTriggerWhatsAppLog}
            />
          )}

          {currentTab === 'calculator' && (
            <SolarCalculatorView
              onCreateLeadFromCalc={calcData => {
                setShowNewLeadModal(true);
              }}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceModule
              userRole={userRole}
              onOpenRoleMatrix={() => setShowRoleMatrixModal(true)}
            />
          )}
        </main>

        {/* Console Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080c22] py-3.5 px-4 sm:px-6 text-xs text-slate-500 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">SOLARQUBE EPC OS</span>
              <span aria-hidden="true">·</span>
              <span>Engineering, Procurement & Commissioning</span>
            </div>
            <div className="flex items-center gap-3 text-[12px] font-mono">
              <button
                onClick={() => setShowRoleMatrixModal(true)}
                className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Role Data Policy</span>
              </button>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Active Profile: <strong className="text-slate-800 dark:text-slate-200 capitalize">{userRole.replace('_', ' ')}</strong></span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        leads={leads}
        onSelectLead={setSelectedLeadForDossier}
        onNavigateTab={setCurrentTab}
        onOpenNewLead={() => setShowNewLeadModal(true)}
      />

      {/* Role & Data Visibility Matrix Modal */}
      {showRoleMatrixModal && (
        <RoleAccessMatrixModal
          currentRole={userRole}
          onChangeRole={handleRoleChange}
          assignedOnlyFilter={assignedOnlyFilter}
          onToggleAssignedOnlyFilter={setAssignedOnlyFilter}
          onClose={() => setShowRoleMatrixModal(false)}
        />
      )}

      {/* Lead Dossier Modal */}
      {selectedLeadForDossier && (
        <LeadDetailModal
          lead={selectedLeadForDossier}
          userRole={userRole}
          onClose={() => setSelectedLeadForDossier(null)}
          onUpdateLead={handleUpdateLead}
          onOpenEmailComposer={lead => {
            setSelectedLeadForDossier(null);
            setLeadForEmailComposer(lead);
          }}
        />
      )}

      {/* New Lead Modal */}
      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onAddLead={handleAddLead}
        />
      )}

      {/* Email Composer */}
      {leadForEmailComposer && (
        <ComposeEmailModal
          lead={leadForEmailComposer}
          sequences={sequences}
          onClose={() => setLeadForEmailComposer(null)}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Tasks & Reminders Modal */}
      {showTasksModal && (
        <TasksRemindersModal
          tasks={tasks}
          leads={leads}
          onClose={() => setShowTasksModal(false)}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
        />
      )}

      {/* Website Embeddable Lead Form Modal */}
      {showWebsiteFormModal && (
        <WebsiteFormModal
          onClose={() => setShowWebsiteFormModal(false)}
          onSubmitLead={handleAddLead}
        />
      )}

      {/* CSV & Backup Modal */}
      {showImportExportModal && (
        <ImportExportModal
          leads={leads}
          onClose={() => setShowImportExportModal(false)}
          onImportLeads={handleImportLeads}
          onRestoreBackup={handleRestoreBackup}
        />
      )}
    </div>
  );
}
