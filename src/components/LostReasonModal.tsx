import React, { useState } from 'react';
import { LostReason } from '../types/crm';
import { X, AlertTriangle } from 'lucide-react';

interface LostReasonModalProps {
  leadName: string;
  onClose: () => void;
  onConfirm: (reason: LostReason, notes: string) => void;
}

export const LostReasonModal: React.FC<LostReasonModalProps> = ({
  leadName,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState<LostReason>('Price too high / Competitor cheaper');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason, notes.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Record Lost Deal Reason</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Please specify the primary obstacle or reason why <strong className="text-slate-900">{leadName}</strong> did not proceed with SolarQube. This data powers our lost-deal win/loss analytics.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Primary Lost Reason *
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value as LostReason)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
            >
              <option value="Price too high / Competitor cheaper">Price too high / Competitor cheaper</option>
              <option value="DISCOM load sanction rejected">DISCOM load sanction rejected</option>
              <option value="Customer postponed / Budget deferred">Customer postponed / Budget deferred</option>
              <option value="Roof structural issues / Severe shading">Roof structural issues / Severe shading</option>
              <option value="Bank solar loan rejected">Bank solar loan rejected</option>
              <option value="Decided not to go solar">Decided not to go solar</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Field Notes & Competitor Intelligence
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Quoted by local vendor at ₹38/W without net metering guarantee..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Confirm Lost Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
