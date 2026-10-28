import React, { useState } from 'react';
import { FollowUpTask, SolarLead } from '../types/crm';
import { TEAM_MEMBERS } from '../data/initialData';
import { X, CheckCircle, Clock, Calendar, Plus, AlertCircle, Phone, UserCheck } from 'lucide-react';

interface TasksRemindersModalProps {
  tasks: FollowUpTask[];
  leads: SolarLead[];
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: FollowUpTask) => void;
}

export const TasksRemindersModal: React.FC<TasksRemindersModalProps> = ({
  tasks,
  leads,
  onClose,
  onToggleTask,
  onAddTask
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<FollowUpTask['type']>('Call');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [assignedTo, setAssignedTo] = useState('Ananya Sharma');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const lead = leads.find(l => l.id === selectedLeadId);
    const newTask: FollowUpTask = {
      id: `tsk-${Date.now()}`,
      leadId: selectedLeadId,
      leadName: lead ? `${lead.customerName} (${lead.recommendedCapacityKw} kWp)` : 'General Lead',
      title: title.trim(),
      type: taskType,
      dueDate,
      dueTime,
      assignedTo,
      completed: false,
      priority
    };

    onAddTask(newTask);
    setTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Solar Sales Follow-Up Tasks & Reminders
            </h2>
            <p className="text-xs text-slate-500">
              Keep momentum across multi-week solar project cycles: calls, surveys, and DISCOM follow-ups
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'pending' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
              }`}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-brand-400" />
            <span>{showAddForm ? 'Close Form' : 'New Reminder'}</span>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Related Customer Lead</label>
                <select
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} ({l.recommendedCapacityKw} kWp · {l.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Action Type</label>
                <select
                  value={taskType}
                  onChange={e => setTaskType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="Call">Call Customer</option>
                  <option value="Site Visit">Site Visit / Survey</option>
                  <option value="Send Revised Quote">Send Revised Quote</option>
                  <option value="DISCOM Verification">DISCOM Verification</option>
                  <option value="Payment Follow-up">Payment Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Task Description *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Call to discuss battery inverter storage options..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Time</label>
                <input
                  type="text"
                  value={dueTime}
                  onChange={e => setDueTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assignee</label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                >
                  {TEAM_MEMBERS.map(m => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-slate-600 bg-slate-200 hover:bg-slate-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded font-medium"
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs italic">
              No tasks in this view.
            </div>
          ) : (
            filteredTasks.map(t => (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  t.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => onToggleTask(t.id)}
                    className="mt-1 rounded accent-slate-900 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold text-slate-900 ${t.completed ? 'line-through text-slate-500' : ''}`}>
                        {t.title}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                        {t.type}
                      </span>
                    </div>

                    <p className="text-[12px] text-slate-600 font-medium">
                      Customer: {t.leadName}
                    </p>

                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {t.dueDate} {t.dueTime ? `· ${t.dueTime}` : ''}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Assigned to {t.assignedTo}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  t.priority === 'High' ? 'bg-rose-50 text-rose-700 font-bold' : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.priority} Priority
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
