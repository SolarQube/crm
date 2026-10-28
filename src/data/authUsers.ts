import { UserRole } from '../types/crm';

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string;
  department: string;
  avatarInitials: string;
  avatarBg: string;
  phone: string;
  badgeLabel: string;
  allowedScopesDescription: string;
}

export const AUTH_USERS: AuthUser[] = [
  {
    id: 'user-admin-01',
    email: 'sneha@solarqubeenergy.in',
    password: 'admin@solarqube',
    name: 'Sneha Patel',
    role: 'admin',
    title: 'Managing Director & EPC Head',
    department: 'Executive Management',
    avatarInitials: 'SP',
    avatarBg: 'bg-brand-600 text-white',
    phone: '+91 98450 11001',
    badgeLabel: 'Founder & Admin',
    allowedScopesDescription: 'Full executive oversight: P&L financials, customer pipeline, attendance, margin control & system settings'
  },
  {
    id: 'user-hr-02',
    email: 'pooja.nair@solarqubeenergy.in',
    password: 'hr@solarqube',
    name: 'Pooja Nair',
    role: 'hr',
    title: 'HR & People Operations Lead',
    department: 'Human Resources & Payroll',
    avatarInitials: 'PN',
    avatarBg: 'bg-rose-500 text-white',
    phone: '+91 98450 55005',
    badgeLabel: 'HR & Payroll',
    allowedScopesDescription: 'Attendance verification, GPS site punch review, leave approvals, regularizations & payroll Excel export'
  },
  {
    id: 'user-sales-03',
    email: 'ananya.sharma@solarqubeenergy.in',
    password: 'sales@solarqube',
    name: 'Ananya Sharma',
    role: 'sales',
    title: 'Senior Solar Sales Consultant',
    department: 'Sales & Business Development',
    avatarInitials: 'AS',
    avatarBg: 'bg-blue-600 text-white',
    phone: '+91 98450 22002',
    badgeLabel: 'Solar Sales Lead',
    allowedScopesDescription: 'Customer lead discovery, Kanban pipeline, customized proposal versions, ROI calculator & WhatsApp outreach'
  },
  {
    id: 'user-coord-04',
    email: 'rajesh.menon@solarqubeenergy.in',
    password: 'projects@solarqube',
    name: 'Rajesh Menon',
    role: 'project_coordinator',
    title: 'Solar Project Coordinator & Logistics',
    department: 'Projects & Logistics',
    avatarInitials: 'RM',
    avatarBg: 'bg-indigo-600 text-white',
    phone: '+91 98450 66006',
    badgeLabel: 'Project Coordinator',
    allowedScopesDescription: 'Resource scheduler (Teams A & B), conflict clash guard, site stage milestones, and labor man-hours allocation'
  },
  {
    id: 'user-siteeng-05',
    email: 'vikram.rao@solarqubeenergy.in',
    password: 'survey@solarqube',
    name: 'Vikram Rao',
    role: 'site_engineer',
    title: 'Lead Feasibility & CAD Surveyor',
    department: 'Technical & Engineering',
    avatarInitials: 'VR',
    avatarBg: 'bg-emerald-600 text-white',
    phone: '+91 98450 33003',
    badgeLabel: 'Site Engineer',
    allowedScopesDescription: '3D shadow analysis, roof structural measurements, DISCOM feasibility, CAD layout audit & site punch'
  },
  {
    id: 'user-install-06',
    email: 'kiran.verma@solarqubeenergy.in',
    password: 'installer@solarqube',
    name: 'Kiran Verma',
    role: 'installer',
    title: 'Lead Installation Supervisor',
    department: 'Projects & Commissioning',
    avatarInitials: 'KV',
    avatarBg: 'bg-cyan-600 text-white',
    phone: '+91 98450 44004',
    badgeLabel: 'Installation Crew Lead',
    allowedScopesDescription: '7-stage installation checklist, Team A crew execution, hardware dispatch verification, and mobile GPS check-in'
  }
];

export const UNIVERSAL_DEMO_PASSWORD = 'solar123';

/**
 * Authenticates user by email/username and password.
 * Accepts exact email or role shorthand (e.g., 'admin', 'hr', 'sales', etc.)
 * Accepts individual password or universal demo password 'solar123'.
 */
export function authenticateUser(identifier: string, passwordInput: string): { success: boolean; user?: AuthUser; message?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPw = passwordInput.trim();

  if (!cleanId) {
    return { success: false, message: 'Please enter your work email or select a role.' };
  }

  // Find user by email or by role shorthand or first name
  const user = AUTH_USERS.find(u => 
    u.email.toLowerCase() === cleanId ||
    u.role.toLowerCase() === cleanId ||
    u.name.toLowerCase().includes(cleanId) ||
    u.id.toLowerCase() === cleanId
  );

  if (!user) {
    return { 
      success: false, 
      message: 'Account not recognized. Try one of the 6 role credentials or click a role card below.' 
    };
  }

  // Check password (matches specific password or UNIVERSAL_DEMO_PASSWORD or 'demo123')
  const isValidPassword = 
    cleanPw === user.password || 
    cleanPw === UNIVERSAL_DEMO_PASSWORD ||
    cleanPw === 'demo123' ||
    cleanPw === 'solarqube';

  if (!isValidPassword) {
    return { 
      success: false, 
      message: `Incorrect password for ${user.name}. Use "${user.password}" or "${UNIVERSAL_DEMO_PASSWORD}".` 
    };
  }

  return { success: true, user };
}

export function getUserForRole(role: UserRole): AuthUser {
  return AUTH_USERS.find(u => u.role === role) || AUTH_USERS[0];
}
