import React, { useState, useEffect } from 'react';
import { SolarLead } from '../types/crm';
import { MainNavTab } from './Sidebar';
import { formatINR } from '../utils/solarCalculator';
import { 
  Search, 
  X, 
  Users, 
  Kanban, 
  Compass, 
  FileText, 
  Plus, 
  ArrowRight,
  Zap,
  Home,
  Building2,
  Factory
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  leads: SolarLead[];
  onSelectLead: (lead: SolarLead) => void;
  onNavigateTab: (tab: MainNavTab) => void;
  onOpenNewLead: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  leads,
  onSelectLead,
  onNavigateTab,
  onOpenNewLead
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLeads = query.trim()
    ? leads.filter(l => {
        const q = query.toLowerCase();
        return (
          l.customerName.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.companyOrSocietyName?.toLowerCase().includes(q) ||
          l.propertyType.toLowerCase().includes(q)
        );
      })
    : leads.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div className="bg-[#0e1432] border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col text-xs">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-brand-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search leads, phone numbers, cities, or type an action..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-hidden"
          />
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-2 overflow-y-auto max-h-[380px] space-y-3">
          {/* Quick Actions */}
          <div className="space-y-1">
            <span className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenNewLead();
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left flex items-center gap-2 text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-brand-400" />
                <span>Add New Solar Lead</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('schedule');
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left flex items-center gap-2 text-slate-200 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                <span>Team Scheduler (A & B)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('pipeline');
                }}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-left flex items-center gap-2 text-slate-200 transition-colors"
              >
                <Kanban className="w-3.5 h-3.5 text-brand-400" />
                <span>Open Kanban Board</span>
              </button>
            </div>
          </div>

          {/* Matched Leads */}
          <div className="space-y-1">
            <span className="px-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              {query.trim() ? `Search Results (${filteredLeads.length})` : 'Recent Solar Leads'}
            </span>

            {filteredLeads.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs italic">
                No matching leads found for "{query}"
              </div>
            ) : (
              filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => {
                    onClose();
                    onSelectLead(lead);
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 text-slate-300 transition-colors group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-brand-400 transition-colors">
                        {lead.customerName}
                      </span>
                      <span className="font-mono text-slate-300 text-[12px]">
                        ({lead.recommendedCapacityKw} kWp)
                      </span>
                    </div>
                    <div className="text-[12px] text-slate-300 flex items-center gap-1.5 font-mono">
                      <span>{lead.city}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lead.phone}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-brand-400/90">{formatINR(lead.netPayableAmount || lead.estimatedQuoteValue)}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-400 transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[12px] text-slate-400 font-mono">
          <span>Navigate with click or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
