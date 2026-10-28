import React, { useState } from 'react';
import { SolarLead, PipelineStage, LostReason, UserRole } from '../types/crm';
import { PIPELINE_STAGES } from '../data/initialData';
import { formatINR } from '../utils/solarCalculator';
import { canViewFinancials } from '../utils/rbac';
import { LostReasonModal } from './LostReasonModal';
import confetti from 'canvas-confetti';
import { 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  Zap, 
  Building2, 
  Home, 
  Factory, 
  Tractor,
  AlertTriangle,
  ArrowRight,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface PipelineViewProps {
  leads: SolarLead[];
  userRole?: UserRole;
  assignedOnlyFilter?: boolean;
  onSelectLead: (lead: SolarLead) => void;
  onOpenEmailComposer: (lead: SolarLead) => void;
  onUpdateLeadStage: (leadId: string, newStage: PipelineStage, lostReason?: LostReason, lostNotes?: string) => void;
  onOpenRoleMatrix?: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  userRole = 'admin',
  assignedOnlyFilter = false,
  onSelectLead,
  onOpenEmailComposer,
  onUpdateLeadStage,
  onOpenRoleMatrix
}) => {
  const [leadForLostModal, setLeadForLostModal] = useState<SolarLead | null>(null);

  const getStageIndex = (stageId: PipelineStage) => {
    return PIPELINE_STAGES.findIndex(s => s.id === stageId);
  };

  const handleAdvance = (lead: SolarLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = getStageIndex(lead.stage);
    if (currIdx < PIPELINE_STAGES.length - 2) { // Won is before Lost
      const nextStage = PIPELINE_STAGES[currIdx + 1].id;
      
      if (nextStage === 'won') {
        try {
          confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.6 }
          });
        } catch {}
      }
      onUpdateLeadStage(lead.id, nextStage);
    }
  };

  const handleRetreat = (lead: SolarLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const currIdx = getStageIndex(lead.stage);
    if (currIdx > 0 && lead.stage !== 'lost') {
      const prevStage = PIPELINE_STAGES[currIdx - 1].id;
      onUpdateLeadStage(lead.id, prevStage);
    }
  };

  const handleMarkLost = (lead: SolarLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setLeadForLostModal(lead);
  };

  const handleConfirmLost = (reason: LostReason, notes: string) => {
    if (!leadForLostModal) return;
    onUpdateLeadStage(leadForLostModal.id, 'lost', reason, notes);
    setLeadForLostModal(null);
  };

  const getPropertyIcon = (propType: string) => {
    switch (propType) {
      case 'Home / Villa':
        return <Home className="w-3.5 h-3.5 text-brand-500" />;
      case 'Factory / Industrial Shed':
        return <Factory className="w-3.5 h-3.5 text-purple-500" />;
      case 'Farm / Agricultural Pump':
        return <Tractor className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const isFinancialAllowed = canViewFinancials(userRole);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Turnkey Solar Pipeline Board
            </h1>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {leads.length} deals active
            </span>
            {assignedOnlyFilter && (
              <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-bold">
                My Assigned Deals Only
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Advance leads through technical milestones: Discovery → Site Feasibility → Proposal → Contract → Won.
          </p>
        </div>

        {onOpenRoleMatrix && (
          <button
            onClick={onOpenRoleMatrix}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Data Visibility Matrix</span>
          </button>
        )}
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 items-start overflow-x-auto pb-4 snap-x">
        {PIPELINE_STAGES.map((stage, idx) => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          const stageKw = stageLeads.reduce((sum, l) => sum + l.recommendedCapacityKw, 0);
          const stageValue = stageLeads.reduce(
            (sum, l) => sum + (l.netPayableAmount || l.estimatedQuoteValue),
            0
          );
          const isWonColumn = stage.id === 'won';
          const isLostColumn = stage.id === 'lost';

          return (
            <div
              key={stage.id}
              className={`flex flex-col rounded-2xl border p-3.5 min-h-[500px] w-[272px] shrink-0 snap-start transition-colors ${
                isWonColumn
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/40'
                  : isLostColumn
                  ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-800/40'
                  : 'bg-slate-100/70 dark:bg-[#0a0f2a] border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Column Header */}
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-500">0{idx + 1}.</span>
                    <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      isLostColumn 
                        ? 'text-rose-700 dark:text-rose-400' 
                        : isWonColumn 
                        ? 'text-emerald-700 dark:text-emerald-400' 
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {stage.shortLabel}
                    </h3>
                  </div>
                  <span className="text-[12px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 mt-1 font-mono tabular-nums">
                  <span>{stageKw.toLocaleString()} kWp</span>
                  {isFinancialAllowed ? (
                    <span>{formatINR(stageValue)}</span>
                  ) : (
                    <span className="text-slate-500">₹ ••••••</span>
                  )}
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 overflow-y-auto pr-0.5 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs italic">
                    No deals in stage
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="p-3.5 bg-white dark:bg-[#0e1432] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all space-y-2.5 cursor-pointer group"
                    >
                      {/* Customer & Type */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                            {lead.customerName}
                          </h4>
                          {lead.companyOrSocietyName && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {lead.companyOrSocietyName}
                            </p>
                          )}
                        </div>
                        {getPropertyIcon(lead.propertyType)}
                      </div>

                      {/* Capacity & Location */}
                      <div className="flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400 font-mono">
                        <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                          <Zap className="w-3 h-3 text-brand-500" />
                          <span>{lead.recommendedCapacityKw} kWp</span>
                        </span>
                        <span className="truncate max-w-[90px]">{lead.city}</span>
                      </div>

                      {/* Deal Value */}
                      <div className="flex items-center justify-between text-xs font-mono pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        {isFinancialAllowed ? (
                          <>
                            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                              {formatINR(lead.netPayableAmount || lead.estimatedQuoteValue)}
                            </span>
                            {lead.customerBudget && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                B: {formatINR(lead.customerBudget)}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-[12px] text-slate-500 font-mono">
                            <Lock className="w-2.5 h-2.5" />
                            <span>₹ •••••• (Protected)</span>
                          </div>
                        )}
                      </div>

                      {/* Lost Reason if lost */}
                      {lead.lostReason && (
                        <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-lg text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                          Lost: {lead.lostReason}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[95px] font-mono">
                          {lead.assignedTo}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onOpenEmailComposer(lead);
                            }}
                            title="Follow-Up Email"
                            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>

                          {stage.id !== 'new' && stage.id !== 'lost' && (
                            <button
                              onClick={e => handleRetreat(lead, e)}
                              title="Move back"
                              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {stage.id !== 'won' && stage.id !== 'lost' && (
                            <>
                              <button
                                onClick={e => handleAdvance(lead, e)}
                                title="Advance stage"
                                className="p-1 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md flex items-center font-bold text-[12px] transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={e => handleMarkLost(lead, e)}
                                title="Mark as Lost Deal"
                                className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md text-[12px] transition-colors font-bold"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lost Reason Modal */}
      {leadForLostModal && (
        <LostReasonModal
          leadName={leadForLostModal.customerName}
          onClose={() => setLeadForLostModal(null)}
          onConfirm={handleConfirmLost}
        />
      )}
    </div>
  );
};
